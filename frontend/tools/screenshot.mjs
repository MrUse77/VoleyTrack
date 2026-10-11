#!/usr/bin/env node
/**
 * tools/screenshot.mjs — deterministic route screenshots + machine-readable design probes.
 *
 * This file is BOTH the CLI launcher (runs under Node) and the Electron main process
 * (when re-executed through an Electron binary). It opens a hidden BrowserWindow at a
 * fixed viewport, waits for the app to really settle (mount + fonts + explicit settle
 * delay), captures the page, and prints a JSON report of fixed DOM probes.
 *
 * Usage (see tools/README.md):
 *   pnpm screenshot --route /login --out screenshots/login.png
 *   pnpm screenshot --route / --out screenshots/dashboard.png --expect "Dashboard público"
 *
 * Exit code is non-zero ONLY when the capture itself fails (unreachable URL, load error,
 * hidden/blank canvas, Vite error overlay, PNG write error). A probe value that does not
 * match the design is REPORTED, never fatal.
 */
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { constants as fsConstants } from "node:fs";
import fs from "node:fs/promises";
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const TOOLS_DIR = path.dirname(SCRIPT_PATH);
const FRONTEND_DIR = path.dirname(TOOLS_DIR);

// ---------------------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------------------

const DEFAULTS = {
  base: process.env.SCREENSHOT_BASE_URL || "http://localhost:5173",
  route: null,
  url: null,
  out: null,
  jsonOut: null,
  width: 1440, // design canvas width (design/html/brand-spec.md)
  height: 900,
  timeout: 30000, // per wait stage, ms
  settle: 1200, // explicit "everything has stopped moving" delay, ms
  freeze: true, // disable animations/transitions/caret blink
  json: true, // print JSON to stdout + write .json next to the PNG
  quiet: false,
  expect: ["VoleyTrack"], // content strings that must be present in body.innerText
};

const USAGE = `Usage: pnpm screenshot -- --route <path> [options]

  --route <path>       Route to capture, e.g. /login (default: /)
  --url <url>          Full URL; overrides --route/--base
  --base <url>         Server origin (default ${DEFAULTS.base} or $SCREENSHOT_BASE_URL)
  --out <file.png>     PNG path (default: screenshots/<slug>.png inside frontend/)
  --json-out <file>    JSON path (default: <out>.json)
  --width <px>         Viewport width (default ${DEFAULTS.width})
  --height <px>        Viewport height (default ${DEFAULTS.height})
  --settle <ms>        Extra settle delay after fonts are ready (default ${DEFAULTS.settle})
  --timeout <ms>       Timeout per wait stage (default ${DEFAULTS.timeout})
  --expect <text>      Required body text (repeatable; "VoleyTrack" is always included)
  --no-freeze          Keep animations, transitions and the caret blinking
  --no-json            Do not print/write the JSON report
  --quiet              Do not print the JSON report to stdout
  -h, --help           Show this help
`;

function parseArgs(argv) {
  const opts = { ...DEFAULTS, expect: [...DEFAULTS.expect] };
  const take = (i, flag) => {
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) {
      throw new Error(`${flag} requires a value`);
    }
    return value;
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const eq = arg.startsWith("--") ? arg.indexOf("=") : -1;
    const flag = eq === -1 ? arg : arg.slice(0, eq);
    const inline = eq === -1 ? null : arg.slice(eq + 1);
    const value = () => {
      if (inline !== null) return inline;
      const v = take(i, flag);
      i += 1;
      return v;
    };
    switch (flag) {
      case "--route": opts.route = value(); break;
      case "--url": opts.url = value(); break;
      case "--base": opts.base = value().replace(/\/$/, ""); break;
      case "--out": opts.out = value(); break;
      case "--json-out": opts.jsonOut = value(); break;
      case "--width": opts.width = Number(value()); break;
      case "--height": opts.height = Number(value()); break;
      case "--settle": opts.settle = Number(value()); break;
      case "--timeout": opts.timeout = Number(value()); break;
      case "--expect": opts.expect.push(value()); break;
      case "--under-electron": break; // internal marker, set by the launcher
      case "--no-freeze": opts.freeze = false; break;
      case "--no-json": opts.json = false; opts.quiet = true; break;
      case "--quiet": opts.quiet = true; break;
      case "-h":
      case "--help": opts.help = true; break;
      default:
        if (arg.startsWith("-")) throw new Error(`Unknown option: ${arg}`);
        if (opts.route === null && opts.url === null) opts.route = arg;
        else throw new Error(`Unexpected argument: ${arg}`);
    }
  }
  for (const key of ["width", "height", "settle", "timeout"]) {
    if (!Number.isFinite(opts[key]) || opts[key] <= 0) {
      throw new Error(`--${key} must be a positive number`);
    }
  }
  if (opts.route === null && opts.url === null) opts.route = "/";
  opts.expect = [...new Set((opts.expect ?? []).filter((s) => s.length > 0))];
  return opts;
}

/** Options arrive from the launcher as JSON, because Electron is re-executed with argv. */
function normalizeOpts(raw) {
  const opts = { ...DEFAULTS, ...raw };
  opts.expect = [...new Set([...(opts.expect ?? [])].filter((s) => s.length > 0))];
  return opts;
}

function resolveTarget(opts) {
  const url = opts.url ?? `${opts.base}${opts.route ?? "/"}`;
  const parsed = new URL(url); // throws with a clear message on a malformed URL
  return { url: parsed.toString(), pathname: parsed.pathname || "/" };
}

function resolveOutputs(opts, pathname) {
  const slug =
    pathname.replace(/^\/+/, "").replace(/\/+$/, "").replace(/[^a-zA-Z0-9]+/g, "-") || "home";
  const png = path.resolve(FRONTEND_DIR, opts.out ?? path.join("screenshots", `${slug}.png`));
  const json = path.resolve(FRONTEND_DIR, opts.jsonOut ?? `${png}.json`);
  return { png, json };
}

// ---------------------------------------------------------------------------------------
// Launcher side (Node)
// ---------------------------------------------------------------------------------------

const ELECTRON_CANDIDATES = [
  process.env.ELECTRON_BIN,
  // Sibling checkout that already ships Electron; adding the binary here costs this repo
  // no dependency. Verified by the existence + exec bit check below.
  path.resolve(FRONTEND_DIR, "..", "..", "open-design", "apps", "desktop", "node_modules", "electron", "dist", "electron"),
  path.resolve(FRONTEND_DIR, "node_modules", "electron", "dist", "electron"),
].filter(Boolean);

async function resolveElectronBin() {
  const errors = [];
  for (const candidate of ELECTRON_CANDIDATES) {
    try {
      await fs.access(candidate, fsConstants.X_OK);
      return candidate;
    } catch (error) {
      errors.push(`${candidate} (${error.code ?? error.message})`);
    }
  }
  throw new Error(
    `No usable Electron binary found. Tried:\n  ${errors.join("\n  ")}\n` +
      `Set ELECTRON_BIN=/path/to/electron to point at one.`,
  );
}

async function waitForServer(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  const attempts = [];
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, {
        redirect: "follow",
        signal: AbortSignal.timeout(Math.min(5000, timeoutMs)),
        headers: { accept: "text/html,*/*" },
      });
      if (res.ok) return { ok: true, status: res.status };
      attempts.push(`HTTP ${res.status}`);
    } catch (error) {
      attempts.push(error.cause?.code ?? error.name ?? String(error));
    }
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  const last = attempts.at(-1) ?? "no attempt completed";
  throw new Error(
    `Target URL is not reachable: ${url} (last error: ${last}, ${attempts.length} attempts).\n` +
      `Start the dev server first, in another terminal:\n` +
      `  cd frontend && pnpm run dev\n` +
      `or serve a production build:\n` +
      `  cd frontend && pnpm run build && pnpm run preview`,
  );
}

function runUnderElectron(bin, opts) {
  return new Promise((resolve) => {
    const env = { ...process.env };
    delete env.ELECTRON_RUN_AS_NODE; // would turn Electron into plain Node
    // The child only sees `--under-electron`, so ship the parsed options through the env.
    env.VT_SCREENSHOT_OPTS = JSON.stringify(opts);
    const child = spawn(bin, [SCRIPT_PATH, "--under-electron"], {
      env,
      stdio: ["ignore", "inherit", "inherit"],
    });
    child.on("error", (error) => {
      console.error(`[screenshot] Failed to launch Electron (${bin}): ${error.message}`);
      resolve(70);
    });
    child.on("exit", (code, signal) => {
      if (signal) {
        console.error(`[screenshot] Electron was killed by ${signal} without writing a capture.`);
        resolve(71);
        return;
      }
      resolve(code ?? 71);
    });
  });
}

async function main() {
  let opts;
  try {
    opts =
      process.versions.electron && process.env.VT_SCREENSHOT_OPTS
        ? normalizeOpts(JSON.parse(process.env.VT_SCREENSHOT_OPTS))
        : parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`[screenshot] ${error.message}\n\n${USAGE}`);
    return 64;
  }
  if (opts.help) {
    console.log(USAGE);
    return 0;
  }

  const { url, pathname } = resolveTarget(opts);
  const output = resolveOutputs(opts, pathname);

  if (!process.versions.electron) {
    const bin = await resolveElectronBin().catch((error) => {
      console.error(`[screenshot] ${error.message}`);
      return null;
    });
    if (!bin) return 69;
    try {
      await waitForServer(url, Math.min(opts.timeout, 20000));
    } catch (error) {
      console.error(`[screenshot] ${error.message}`);
      return 68;
    }
    return runUnderElectron(bin, opts);
  }

  return electronEntry(opts, url, output);
}

/**
 * Electron ESM entry-point gotcha (verified empirically with Electron 41.3.0):
 * the `ready` event is emitted only AFTER the main entry module finishes evaluating,
 * so a top-level `await app.whenReady()` deadlocks forever. This module therefore
 * never awaits `whenReady()` at evaluation time: it registers a `.then()` handler and
 * returns, letting the module evaluation complete.
 */
function electronEntry(opts, url, output) {
  const require = createRequire(import.meta.url);
  const { app, BrowserWindow } = require("electron");
  // A dedicated profile: the default ~/.config/Electron is shared with other Electron apps
  // on this machine and sharing it makes the GPU/zygote processes fail (FATAL: "GPU process
  // isn't usable. Goodbye."). It is a single stable path, reused between runs, so nothing
  // accumulates and no cleanup/delete step is needed (and none would be reliable while the
  // helper processes are still writing into it).
  const profileDir = path.join(os.tmpdir(), "voleytrack-screenshot-profile");
  mkdirSync(profileDir, { recursive: true });
  app.setPath("userData", profileDir);
  app.setPath("sessionData", profileDir);
  // These switches are only honoured before `ready`, so they live here.
  if (process.env.VT_SCREENSHOT_SOFTWARE_RENDER === "1") {
    app.disableHardwareAcceleration(); // software rendering, at the cost of hidden capture
  }
  app.commandLine.appendSwitch("force-device-scale-factor", "1");
  app.commandLine.appendSwitch("disable-lcd-text");
  app.whenReady().then(
    () =>
      captureInElectron({ app, BrowserWindow }, opts, url, output)
        .then((code) => app.exit(code))
        .catch((error) => {
          console.error(`[screenshot] Unexpected failure: ${error?.stack ?? error?.message ?? error}`);
          app.exit(1);
        }),
    (error) => {
      console.error(`[screenshot] Electron never became ready: ${error?.message ?? error}`);
      app.exit(1);
    },
  );
  return 0;
}

// ---------------------------------------------------------------------------------------
// Electron side
// ---------------------------------------------------------------------------------------

const PROBE_SOURCE = `(() => {
  const round = (n) => Math.round(n * 100) / 100;
  const rect = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { width: round(r.width), height: round(r.height) };
  };
  const pick = (selectors) => {
    for (const selector of selectors) {
      const el = document.querySelector(selector);
      if (el) return { el, selector };
    }
    return { el: null, selector: null };
  };

  const families = ["Inter", "JetBrains Mono"];
  const loadedFaces = new Set();
  document.fonts.forEach((face) => {
    if (face.status === "loaded") loadedFaces.add(face.family.replace(/^["']|["']$/g, ""));
  });
  const fontFamilies = {};
  for (const family of families) {
    fontFamilies[family] = {
      cssCheck: document.fonts.check('16px "' + family + '"'),
      loadedInFontFaceSet: loadedFaces.has(family),
    };
  }

  const header = pick(["header", "[role='banner']", "[data-testid='topbar']"]);
  const sidebar = pick(["aside", "[role='complementary']", "[data-testid='sidebar']"]);

  const accentStrategies = [
    ["nav active item", "aside [aria-current]", "expectsAccentBackground"],
    ["button", "button", "expectsAccentBackground"],
    ["accent utility class", "[class*='bg-vt-accent']", "expectsAccentBackground"],
  ];
  let accent = null;
  for (const [strategy, selector] of accentStrategies) {
    const el = document.querySelector(selector);
    if (!el) continue;
    const cs = getComputedStyle(el);
    accent = {
      strategy,
      selector,
      tag: el.tagName.toLowerCase(),
      text: (el.innerText || el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 60),
      color: cs.color,
      backgroundColor: cs.backgroundColor,
      accentPresent: cs.backgroundColor === "rgb(255, 140, 66)",
    };
    break;
  }

  const expected = __EXPECTED__;
  const innerText = document.body.innerText || "";
  const expectedStrings = expected.map((value) => ({ value, found: innerText.includes(value) }));

  const root = document.getElementById("root");
  const overlay = document.querySelector("vite-error-overlay, #vite-error-overlay, .vite-error-overlay");

  return {
    title: document.title,
    readyState: document.readyState,
    probes: {
      fonts: {
        status: document.fonts.status,
        fontFaceSetSize: document.fonts.size,
        bodyFontFamily: getComputedStyle(document.body).fontFamily,
        families: fontFamilies,
      },
      topbar: header.el
        ? {
            selector: header.selector,
            present: true,
            ...rect(header.el),
            expectedHeight: 72,
            matchesDesign: rect(header.el).height === 72,
          }
        : { present: false, expectedHeight: 72, matchesDesign: false },
      sidebar: sidebar.el
        ? {
            selector: sidebar.selector,
            present: true,
            ...rect(sidebar.el),
            expectedWidth: 248,
            matchesDesign: rect(sidebar.el).width === 248,
          }
        : { present: false, expectedWidth: 248, matchesDesign: false },
      accent,
      content: {
        innerTextLength: innerText.trim().length,
        innerTextPreview: innerText.trim().replace(/\\s+/g, " ").slice(0, 160),
        rootChildElements: root ? root.childElementCount : -1,
        bodyBackgroundColor: getComputedStyle(document.body).backgroundColor,
        viteErrorOverlay: Boolean(overlay),
        overlayText: overlay ? (overlay.textContent || "").slice(0, 200) : null,
        expectedStrings,
        allExpectedStringsFound: expectedStrings.every((entry) => entry.found),
      },
    },
  };
})()`;

const FREEZE_CSS = `
/* Determinism: no entry animations, no transitions, no caret blink. */
*, *::before, *::after {
  animation: none !important;
  transition: none !important;
  caret-color: transparent !important;
}
`;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const CAPTURE_TIMEOUT_MS = 10000;

const NEXT_PAINT = `new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve(true))))`;

/**
 * A hidden (`show: false`) window is occluded, so Chromium may never emit animation
 * frames and a bare requestAnimationFrame promise would hang forever. Race it with a
 * short timer so waiting for a paint can never deadlock.
 */
async function waitForPaint(wc, fallbackMs = 500) {
  await Promise.race([
    wc.executeJavaScript(NEXT_PAINT, true).catch(() => true),
    delay(fallbackMs),
  ]);
}

/**
 * Cheap non-blankness proof that needs no image decoder: sample the raw BGRA bitmap
 * returned by NativeImage.toBitmap() and report colour diversity. A blank canvas or a
 * solid error page collapses to a single flat colour.
 */
function describePixels(bitmap, step = 997) {
  const counts = new Map();
  let sampled = 0;
  for (let offset = 0; offset + 3 < bitmap.length; offset += 4 * step) {
    const key = `${bitmap[offset + 2]},${bitmap[offset + 1]},${bitmap[offset]},${bitmap[offset + 3]}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
    sampled += 1;
  }
  let dominant = "0,0,0,0";
  let dominantCount = 0;
  for (const [color, count] of counts) {
    if (count > dominantCount) {
      dominant = color;
      dominantCount = count;
    }
  }
  const [red, green, blue, alpha] = dominant.split(",").map(Number);
  return {
    sampledPixels: sampled,
    distinctColors: counts.size,
    dominantColor: `rgba(${red}, ${green}, ${blue}, ${Math.round((alpha / 255) * 100) / 100})`,
    dominantColorShare: sampled ? Math.round((dominantCount / sampled) * 10000) / 10000 : 0,
    isFlatSingleColor: counts.size === 1,
  };
}

/** `capturePage()` can hang when the compositor refuses to produce a frame; bound it. */
async function tryCapture(wc, timeoutMs) {
  return Promise.race([
    wc.capturePage(),
    delay(timeoutMs).then(() =>
      Promise.reject(new Error(`capturePage() did not resolve within ${timeoutMs}ms`)),
    ),
  ]);
}

async function captureInElectron({ app, BrowserWindow }, opts, url, output) {
  const startedAt = Date.now();
  const problems = [];
  const timing = {};
  let exitCode = 0;

  // Watchdog: never let a stuck wait turn into a hanging process.
  const watchdogMs = opts.timeout * 3 + opts.settle + 10000;
  const watchdog = setTimeout(() => {
    console.error(`[screenshot] Watchdog fired after ${watchdogMs}ms — exiting non-zero.`);
    app.exit(1);
  }, watchdogMs);

  // Progress goes to stderr, so stdout stays a clean JSON document.
  const log = (message) => console.error(`[screenshot] ${message}`);

  const win = new BrowserWindow({
    show: false, // hidden window; paintWhenInitiallyHidden keeps it rendering
    paintWhenInitiallyHidden: true,
    width: opts.width,
    height: opts.height,
    useContentSize: true,
    backgroundColor: "#0b1220",
    webPreferences: {
      spellcheck: false, // red squiggles are nondeterministic
      backgroundThrottling: false,
      zoomFactor: 1,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  win.webContents.setZoomFactor(1);
  win.setContentSize(opts.width, opts.height);
  log(`window created (${opts.width}x${opts.height} content, hidden)`);

  const wc = win.webContents;
  let loadFailure = null;
  wc.on("did-fail-load", (_event, errorCode, errorDescription, failedUrl, isMainFrame) => {
    if (isMainFrame && errorCode !== -3 /* ERR_ABORTED */) {
      loadFailure = { errorCode, errorDescription, failedUrl };
    }
  });
  wc.on("render-process-gone", (_event, details) => {
    loadFailure = { errorCode: "render-process-gone", errorDescription: details.reason, failedUrl: url };
  });

  const fail = async (message, code = 1) => {
    problems.push(message);
    exitCode = code;
  };

  try {
    // The profile is reused across runs, so drop the HTTP cache to make sure the browser
    // never serves stale JS/CSS from a previous capture of the same URL.
    await wc.session.clearCache().catch(() => {});

    const loadStart = Date.now();
    log(`loading ${url}`);
    try {
      await wc.loadURL(url, { timeout: opts.timeout });
    } catch (error) {
      await fail(`Page load failed for ${url}: ${error.message}`);
    }
    timing.loadMs = Date.now() - loadStart;
    log(`load finished in ${timing.loadMs}ms`);
    if (loadFailure) {
      await fail(`Load error for ${url}: ${loadFailure.errorDescription} (${loadFailure.errorCode})`);
    }

    const poll = async (label, expression, timeoutMs) => {
      const deadline = Date.now() + timeoutMs;
      let last = null;
      while (Date.now() < deadline) {
        try {
          const result = await wc.executeJavaScript(expression, true);
          if (result) return true;
        } catch (error) {
          last = error;
        }
        await delay(100);
      }
      await fail(`Timed out after ${timeoutMs}ms waiting for ${label}${last ? ` (${last.message})` : ""}`);
      return false;
    };

    if (exitCode === 0) {
      const mountStart = Date.now();
      await poll(
        "React to mount (#root has children)",
        "document.readyState === 'complete' && (document.getElementById('root')?.childElementCount ?? 0) > 0",
        opts.timeout,
      );
      timing.mountMs = Date.now() - mountStart;
      log(`react mounted in ${timing.mountMs}ms`);

      const fontsStart = Date.now();
      await wc.executeJavaScript("document.fonts.ready.then(() => true)", true).catch(() => {});
      await poll("web fonts to load", "document.fonts.status === 'loaded'", opts.timeout);
      timing.fontsMs = Date.now() - fontsStart;
      log(`fonts ready in ${timing.fontsMs}ms`);

      const settleStart = Date.now();
      await waitForPaint(wc);
      await delay(opts.settle); // explicit, generous "nothing is moving" window
      timing.settleMs = Date.now() - settleStart;
      log(`settled (+${timing.settleMs}ms)`);

      if (opts.freeze) {
        await wc.insertCSS(FREEZE_CSS);
        await waitForPaint(wc);
        await delay(200);
        log("animations/transitions/caret frozen");
      }
    }

    let report = null;
    log("running DOM probes");
    try {
      const source = PROBE_SOURCE.replace("__EXPECTED__", JSON.stringify(opts.expect));
      report = await wc.executeJavaScript(source, true);
    } catch (error) {
      await fail(`Could not run DOM probes: ${error.message}`);
    }

    const probes = report?.probes;
    if (probes) {
      const { content, fonts } = probes;
      if (content.viteErrorOverlay) {
        await fail(`Vite error overlay is present on ${url}: ${content.overlayText}`);
      }
      if (content.innerTextLength === 0 || content.rootChildElements <= 0) {
        await fail(
          `Page looks blank on ${url}: innerTextLength=${content.innerTextLength}, rootChildElements=${content.rootChildElements}`,
        );
      }
      if (content.innerTextLength > 0 && !content.allExpectedStringsFound) {
        const missing = content.expectedStrings.filter((e) => !e.found).map((e) => JSON.stringify(e.value));
        problems.push(`Content check: missing expected strings ${missing.join(", ")} (not fatal by design)`);
      }
      if (fonts.status !== "loaded") {
        problems.push(`Font check: document.fonts.status=${fonts.status} (probes may be unstable)`);
      }
    } else if (exitCode === 0) {
      await fail("No DOM probes were collected");
    }

    // Always try to capture so the failure is diagnosable, but never claim success.
    log("capturing page");
    let captureMode = "hidden";
    let captured = null;
    try {
      captured = await tryCapture(wc, CAPTURE_TIMEOUT_MS);
    } catch (hiddenError) {
      // Fallback: a shown window always produces frames. Used only if hidden capture fails.
      log(`hidden capture failed (${hiddenError.message}); retrying with showInactive()`);
      try {
        win.showInactive();
        await waitForPaint(wc);
        await delay(600);
        captured = await tryCapture(wc, CAPTURE_TIMEOUT_MS);
        captureMode = "shown-inactive";
      } catch (shownError) {
        await fail(`capturePage() failed: ${shownError.message} (hidden attempt: ${hiddenError.message})`);
      }
    }

    let size = { width: 0, height: 0 };
    let png = Buffer.alloc(0);
    let pixels = null;
    if (captured) {
      size = captured.getSize();
      png = captured.toPNG();
      pixels = describePixels(captured.toBitmap());
      log(
        `captured via ${captureMode}: ${size.width}x${size.height}, ${png.length} bytes, ` +
          `${pixels.distinctColors} distinct sampled colours, dominant ${pixels.dominantColor} (${pixels.dominantColorShare})`,
      );
      if (size.width === 0 || size.height === 0 || png.length === 0) {
        await fail(`capturePage() returned an empty image (${size.width}x${size.height}, ${png.length} bytes)`);
      } else if (pixels.isFlatSingleColor) {
        await fail(`captured image is one flat colour (${pixels.dominantColor}) — nothing rendered`);
      } else {
        await fs.mkdir(path.dirname(output.png), { recursive: true });
        await fs.writeFile(output.png, png);
      }
    }

    const jsonReport = {
      tool: "tools/screenshot.mjs",
      mode: "electron",
      captureMode,
      capturedAt: new Date().toISOString(),
      url,
      viewport: { width: opts.width, height: opts.height, deviceScaleFactor: 1 },
      frozen: opts.freeze,
      output: {
        png: output.png,
        json: opts.json ? output.json : null,
        bytes: png.length,
        width: size.width,
        height: size.height,
        sha256: createHash("sha256").update(png).digest("hex"),
      },
      pixels,
      timing: { ...timing, totalMs: Date.now() - startedAt },
      designReference: {
        canvasWidth: 1440,
        topbarHeight: 72,
        sidebarWidth: 248,
        accent: "#ff8c42 / rgb(255, 140, 66)",
        bodyFont: "Inter",
      },
      probes: probes ?? null,
      problems,
      exitCode,
    };

    if (opts.json && png.length > 0) {
      await fs.mkdir(path.dirname(output.json), { recursive: true });
      await fs.writeFile(output.json, `${JSON.stringify(jsonReport, null, 2)}\n`);
    }
    if (!opts.quiet) console.log(JSON.stringify(jsonReport, null, 2));
    if (exitCode !== 0) {
      console.error(`[screenshot] FAILED: ${problems.join(" | ")}`);
    }
  } catch (error) {
    console.error(`[screenshot] Unexpected failure: ${error.stack ?? error.message}`);
    exitCode = 1;
  } finally {
    win.destroy();
    clearTimeout(watchdog);
  }

  return exitCode;
}

// Via app.exit() Electron terminates the process itself; Node needs the exit code set.
// NOTE: never add a top-level await here — see electronEntry() for why.
main().then((code) => {
  if (!process.versions.electron) process.exitCode = code;
});
