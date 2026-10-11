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
      // Computed geometry of the accent element, so a rendered-level style change (for
      // example the .btn pill radius) is machine-readable even when images are not.
      borderRadius: cs.borderRadius,
      height: cs.height,
      fontSize: cs.fontSize,
    };
    break;
  }

  // Additive only: no existing strategy above is reordered or redefined. The Button
  // primitive renders the design's pill (rounded-full, .btn at voleytrack.css:69) on a
  // bg-vt-accent button, while the screens that still hand-roll their own accent
  // control use rounded-lg. Reporting the computed geometry of every accent-filled
  // button on the page makes that difference machine-readable even when the accent probe
  // above lands on a sidebar nav item, which it does on every shelled route.
  const accentControls = Array.from(document.querySelectorAll('button[class*="bg-vt-accent"]'))
    .slice(0, 8)
    .map((el) => {
      const cs = getComputedStyle(el);

      return {
        text: (el.innerText || el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 40),
        backgroundColor: cs.backgroundColor,
        borderRadius: cs.borderRadius,
        height: cs.height,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
      };
    });

  // Additive only: no existing strategy above is reordered or redefined. The design's
  // .nav-item (voleytrack.css:53) is 13px/600 with a 10px gap and padding, a 10px radius,
  // a transparent 1px border and --muted ink, and .nav-item.active (line 55) is the
  // accent fill with #0b1220 ink on it. Reporting the resolved typography, ink and geometry
  // of the first and the active sidebar link makes the nav parity claim machine-readable
  // instead of a class-name assertion; isActive proves the accessible hook is still the
  // aria-current that the accent strategy above depends on.
  const describeNavItem = (el) => {
    if (!el) return null;

    const cs = getComputedStyle(el);

    return {
      tag: el.tagName.toLowerCase(),
      text: (el.innerText || el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 40),
      isActive: el.getAttribute("aria-current") === "page",
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      color: cs.color,
      backgroundColor: cs.backgroundColor,
      paddingTop: cs.paddingTop,
      paddingRight: cs.paddingRight,
      paddingBottom: cs.paddingBottom,
      paddingLeft: cs.paddingLeft,
      columnGap: cs.columnGap,
      borderRadius: cs.borderRadius,
      borderWidth: cs.borderTopWidth,
      borderColor: cs.borderTopColor,
    };
  };
  const navItem = {
    first: describeNavItem(document.querySelector("aside nav a")),
    active: describeNavItem(document.querySelector("aside nav a[aria-current]")),
  };

  // Additive only. The design's .page-head h1 (voleytrack.css:66) is 28px/900 with
  // -0.02em letter-spacing and .page-head p (line 67) is 13px in --muted with a 6px top
  // margin and a 60ch measure. The shell's own h1 lives in the header, so the first
  // main h1 is the page heading on every shelled route.
  const describeHeadingPart = (el) => {
    if (!el) return null;

    const cs = getComputedStyle(el);

    return {
      tag: el.tagName.toLowerCase(),
      text: (el.innerText || el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 40),
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight,
      letterSpacing: cs.letterSpacing,
      color: cs.color,
      marginTop: cs.marginTop,
      maxWidth: cs.maxWidth,
    };
  };
  const pageHeadingElement = document.querySelector("main h1");
  const pageHeading = pageHeadingElement
    ? {
        h1: describeHeadingPart(pageHeadingElement),
        description: describeHeadingPart(pageHeadingElement.parentElement?.querySelector("p") ?? null),
      }
    : null;

  // Additive only. The design's numeric table treatment (.num, voleytrack.css:100:
  // mono family, tabular figures, right alignment) is a property of the shared table
  // primitive, so this probe reports the resolved typography of the first treated header
  // cell and the first treated body cell. That makes the end-to-end claim machine-readable:
  // the JetBrains Mono entry above flips to loaded because a real cell asks for the
  // family, not because a class name is present, and fontVariantNumeric proves the tabular
  // figures survived the cascade. Null on a route that renders no treated cell.
  const describeNumericCell = (el) => {
    if (!el) return null;

    const cs = getComputedStyle(el);

    return {
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 40),
      fontFamily: cs.fontFamily,
      fontVariantNumeric: cs.fontVariantNumeric,
      textAlign: cs.textAlign,
    };
  };
  const numericHeader = document.querySelector('th[class*="tabular-nums"]');
  const numericBody = document.querySelector('td[class*="tabular-nums"]');
  const numericTreatment = numericHeader || numericBody
    ? { header: describeNumericCell(numericHeader), body: describeNumericCell(numericBody) }
    : null;

  // Additive only: no existing key, strategy order or shape above is renamed, reordered or
  // redefined. The design's featured live card opens with the live pill
  // (voleytrack.css:61: --danger fill, white ink, mono 10px/800) and the upcoming rows carry
  // the design's state-pill states (voleytrack.css:84-87). Both are found through the
  // accessible hooks the primitives already declare, not through a Tailwind class: the live
  // pill is role="status" on the danger fill, and StatePill exposes data-status.
  const describePill = (el) => {
    if (!el) return null;

    const cs = getComputedStyle(el);

    return {
      tag: el.tagName.toLowerCase(),
      text: (el.innerText || el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 40),
      role: el.getAttribute("role"),
      ariaLive: el.getAttribute("aria-live"),
      status: el.getAttribute("data-status"),
      backgroundColor: cs.backgroundColor,
      color: cs.color,
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      borderRadius: cs.borderRadius,
    };
  };
  const livePills = Array.from(
    document.querySelectorAll('[role="status"][class*="bg-vt-danger"]'),
  ).map(describePill);
  const statePills = Array.from(document.querySelectorAll("[data-status]")).map(describePill);

  // Additive only. The design's live grid is 1.6fr by .9fr with a 16px gap
  // (voleytrack.css:79) and collapses to one column below 1100px
  // (voleytrack-dashboard.css:3); its row-match is 140px 1fr 160px 170px 100px with a
  // 12px gap and 14px 20px padding (voleytrack-dashboard.css:11). Reporting the resolved
  // tracks plus each child's rendered box makes the split machine-readable without an image.
  const describeGrid = (testId) => {
    const el = document.querySelector('[data-testid="' + testId + '"]');
    if (!el) return null;

    const cs = getComputedStyle(el);

    return {
      selector: '[data-testid="' + testId + '"]',
      present: true,
      display: cs.display,
      gridTemplateColumns: cs.gridTemplateColumns,
      columnGap: cs.columnGap,
      paddingTop: cs.paddingTop,
      paddingRight: cs.paddingRight,
      paddingBottom: cs.paddingBottom,
      paddingLeft: cs.paddingLeft,
      children: Array.from(el.children).map((child) => {
        const r = child.getBoundingClientRect();
        return { tag: child.tagName.toLowerCase(), width: round(r.width), height: round(r.height) };
      }),
    };
  };
  const liveGrid = describeGrid("dashboard-live-grid");
  const upcomingRowGrid = describeGrid("dashboard-upcoming-row");
  // Additive only, alongside (never replacing) the two dashboard grids above.
  const matchesGrid = describeGrid("matches-grid");
  const tournamentsGrid = describeGrid("tournaments-grid");

  // Additive only. The structural card form puts its spacing in CardBody's .card-b padding
  // (18px 20px, voleytrack.css:78) while the legacy transitional form is a uniform p-6 (24px),
  // so the padding actually applied by CardBody is what distinguishes the two at the rendered
  // level. Every CardBody in the tree is found through its -card-body test id hook.
  const cardBodies = Array.from(document.querySelectorAll('[data-testid$="-card-body"]')).map(
    (el) => {
      const cs = getComputedStyle(el);

      return {
        testId: el.getAttribute("data-testid"),
        paddingTop: cs.paddingTop,
        paddingRight: cs.paddingRight,
        paddingBottom: cs.paddingBottom,
        paddingLeft: cs.paddingLeft,
      };
    },
  );

  // Additive only. The design's numeric treatment is the mono family with tabular figures
  // (.num, voleytrack.css:100, primitive Num). The numericTreatment key above only
  // inspects th/td cells, so a score or a time rendered outside a table is invisible to it;
  // this reports the first element carrying the treatment anywhere on the page.
  const tabularSampleElement = document.querySelector('[class*="tabular-nums"]');
  const describeTabular = (el) => ({
    tag: el.tagName.toLowerCase(),
    text: (el.innerText || el.textContent || "")
      .trim()
      .replace(/\\s+/g, " ")
      .slice(0, 40),
    fontFamily: getComputedStyle(el).fontFamily,
    fontVariantNumeric: getComputedStyle(el).fontVariantNumeric,
    fontSize: getComputedStyle(el).fontSize,
    fontWeight: getComputedStyle(el).fontWeight,
  });
  // Additive only, alongside (never replacing) tabularSample above: the single first match
  // proves the treatment exists somewhere, and this list makes the specific elements it is
  // applied to - a score, a clock, a fixture time - readable one by one.
  const tabularSamples = Array.from(document.querySelectorAll('[class*="tabular-nums"]'))
    .slice(0, 8)
    .map(describeTabular);
  const tabularSample = tabularSampleElement ? describeTabular(tabularSampleElement) : null;

  // Additive only. The design's featured card is a two-layer background:
  // linear-gradient(180deg,#162032,#111a2b) with a radial accent glow over it
  // (voleytrack-dashboard.css:4-5), a single-vs-two-layer difference that no class-name
  // assertion can see. Reporting the resolved background layers proves the design's two
  // surface tones (--surface-2 to --surface) actually rendered.
  const liveSurfaceElement = document.querySelector('[data-testid="dashboard-live-featured"]');
  const highlightsElement = document.querySelector('[data-testid="dashboard-highlights"]');
  const liveSurface = liveSurfaceElement
    ? {
        featuredBackgroundImage: getComputedStyle(liveSurfaceElement).backgroundImage,
        featuredBackgroundColor: getComputedStyle(liveSurfaceElement).backgroundColor,
        featuredBorderColor: getComputedStyle(liveSurfaceElement).borderTopColor,
        featuredBorderRadius: getComputedStyle(liveSurfaceElement).borderRadius,
        highlightsBackgroundColor: highlightsElement
          ? getComputedStyle(highlightsElement).backgroundColor
          : null,
        highlightsBorderRadius: highlightsElement
          ? getComputedStyle(highlightsElement).borderRadius
          : null,
      }
    : null;

  // Additive only: no existing key, strategy, order or shape above is renamed, reordered or
  // redefined. The design's filter row is .filters with .filter / .filter.active
  // (voleytrack.css:88-89, primitives FilterGroup/Filter), whose ACTIVE treatment is the
  // inverted light pill: a --fg fill with --bg ink and a --fg border. Reading the pressed
  // button's computed colours proves that inversion rendered, which no class assertion can.
  const describeFilterGroup = (el) => {
    if (!el) return null;

    const active = el.querySelector('button[aria-pressed="true"]');
    const activeStyle = active ? getComputedStyle(active) : null;

    return {
      label: el.getAttribute("aria-label"),
      role: el.getAttribute("role"),
      pillCount: el.querySelectorAll("button").length,
      pressedCount: el.querySelectorAll('button[aria-pressed="true"]').length,
      active: active && activeStyle
        ? {
            text: (active.innerText || active.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 40),
            backgroundColor: activeStyle.backgroundColor,
            color: activeStyle.color,
            borderColor: activeStyle.borderTopColor,
            borderRadius: activeStyle.borderRadius,
            height: activeStyle.height,
            fontSize: activeStyle.fontSize,
            fontWeight: activeStyle.fontWeight,
          }
        : null,
    };
  };
  const filterGroups = Array.from(document.querySelectorAll('[role="group"][aria-label]'))
    .map(describeFilterGroup);

  // Additive only. The design's .mcard is 16px padding on a --surface fill with a 1px
  // --border edge and a 16px radius (voleytrack-partidos.css:3), and the tournament card is
  // the design's own padding:16px with a 52px right edge (voleytrack-torneos.html). Reporting it
  // card's resolved box makes the card padding actually applied machine-readable.
  const firstMatchCard = document.querySelector('[data-testid="public-match-card"]');
  const matchCard = firstMatchCard
    ? (() => {
        const cs = getComputedStyle(firstMatchCard);
        return {
          backgroundColor: cs.backgroundColor,
          borderColor: cs.borderTopColor,
          borderRadius: cs.borderTopLeftRadius,
          paddingTop: cs.paddingTop,
          paddingRight: cs.paddingRight,
          paddingBottom: cs.paddingBottom,
          paddingLeft: cs.paddingLeft,
        };
      })()
    : null;

  // Additive only. The design's bracket (voleytrack-torneos.css:62-86) is a scrollable
  // region holding a grid of 230px round columns at a 28px gap, each round a column of
  // .bracket-match cards whose own box is 82px min-height, 9px 10px 8px padding, a 1px
  // edge and a 3px --accent left edge. These keys report the rounds, their headings, the
  // matches and the resolved box of the first match, so the widget's presence and layout are
  // machine-readable instead of only visual.
  const bracketElement = document.querySelector('[data-testid="tournament-bracket"]');
  const bracketGrid = bracketElement ? bracketElement.querySelector("ol") : null;
  const bracket = bracketElement
    ? (() => {
        const gridStyle = bracketGrid ? getComputedStyle(bracketGrid) : null;
        const rounds = Array.from(bracketElement.querySelectorAll(":scope > ol > li"));
        const firstMatch = bracketElement.querySelector("[data-bracket-match]");
        const matchStyle = firstMatch ? getComputedStyle(firstMatch) : null;
        // Additive: the design paints its LAST round's match with .bracket-match--final
        // (accent edge and accent-soft fill), so the final's own box is reported next to the
        // first round's plain --surface-2 box instead of leaving the two indistinguishable.
        const lastMatch = Array.from(bracketElement.querySelectorAll("[data-bracket-match]")).at(-1);
        const lastMatchStyle = lastMatch ? getComputedStyle(lastMatch) : null;
        return {
          present: true,
          role: bracketElement.getAttribute("role"),
          ariaLabel: bracketElement.getAttribute("aria-label"),
          tabIndex: bracketElement.tabIndex,
          overflowX: getComputedStyle(bracketElement).overflowX,
          padding: getComputedStyle(bracketElement).padding,
          gridTemplateColumns: gridStyle ? gridStyle.gridTemplateColumns : null,
          columnGap: gridStyle ? gridStyle.columnGap : null,
          roundCount: rounds.length,
          rounds: rounds.map((round) => ({
            heading: (round.querySelector("h3")?.textContent || "").trim(),
            matches: round.querySelectorAll("[data-bracket-match]").length,
          })),
          matchCount: bracketElement.querySelectorAll("[data-bracket-match]").length,
          matchAriaLabels: Array.from(bracketElement.querySelectorAll("[data-bracket-match]"))
            .slice(0, 3)
            .map((match) => match.getAttribute("aria-label")),
          firstMatch: matchStyle
            ? {
                minHeight: matchStyle.minHeight,
                paddingTop: matchStyle.paddingTop,
                paddingRight: matchStyle.paddingRight,
                paddingBottom: matchStyle.paddingBottom,
                paddingLeft: matchStyle.paddingLeft,
                borderLeftWidth: matchStyle.borderLeftWidth,
                borderLeftColor: matchStyle.borderLeftColor,
                borderRadius: matchStyle.borderTopLeftRadius,
                backgroundColor: matchStyle.backgroundColor,
              }
            : null,
          lastMatch: lastMatchStyle
            ? {
                minHeight: lastMatchStyle.minHeight,
                borderLeftWidth: lastMatchStyle.borderLeftWidth,
                borderLeftColor: lastMatchStyle.borderLeftColor,
                borderTopColor: lastMatchStyle.borderTopColor,
                backgroundColor: lastMatchStyle.backgroundColor,
              }
            : null,
        };
      })()
    : null;

  const expected = __EXPECTED__;
  const innerText = document.body.innerText || "";
  const expectedStrings = expected.map((value) => ({ value, found: innerText.includes(value) }));

  const root = document.getElementById("root");
  const overlay = document.querySelector("vite-error-overlay, #vite-error-overlay, .vite-error-overlay");

  // Additive only: a dedicated computed-style handle for the sidebar's surface and divider,
  // so the new keys below can read them without touching the calls the existing keys use.
  const sidebarStyle = sidebar.el ? getComputedStyle(sidebar.el) : null;

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
            // Additive: the design sidebar's own padding of 20px by 14px (.sidebar,
            // voleytrack.css:50), so the padding is machine-readable next to the width.
            paddingTop: getComputedStyle(sidebar.el).paddingTop,
            paddingRight: getComputedStyle(sidebar.el).paddingRight,
            paddingBottom: getComputedStyle(sidebar.el).paddingBottom,
            paddingLeft: getComputedStyle(sidebar.el).paddingLeft,
            // Additive only: no existing key above is renamed, reordered or redefined. The
            // design's .sidebar rule is background:var(--surface) plus
            // border-right:1px solid var(--border-2) (voleytrack.css:50 and
            // voleytrack-admin.css:55), i.e. the
            // elevated #111a2b fill and the subtler #1e293b divider, on BOTH shells. Those
            // two declarations were applied nowhere the old probe could see, so the surface
            // could silently drift to the canvas fill or the heavier --border tone. These
            // keys make the rendered values machine-readable.
            backgroundColor: sidebarStyle.backgroundColor,
            expectedBackgroundColor: "rgb(17, 26, 43)",
            matchesSurface: sidebarStyle.backgroundColor === "rgb(17, 26, 43)",
            borderRightWidth: sidebarStyle.borderRightWidth,
            borderRightStyle: sidebarStyle.borderRightStyle,
            borderRightColor: sidebarStyle.borderRightColor,
            expectedBorderRight: "1px solid rgb(30, 41, 59)",
            matchesBorderRight:
              sidebarStyle.borderRightWidth === "1px" &&
              sidebarStyle.borderRightStyle === "solid" &&
              sidebarStyle.borderRightColor === "rgb(30, 41, 59)",
          }
        : { present: false, expectedWidth: 248, matchesDesign: false },
      accent,
      accentControls,
      navItem,
      pageHeading,
      numericTreatment,
      // Additive keys: new names only, every key above is unchanged.
      livePills,
      statePills,
      liveGrid,
      upcomingRowGrid,
      cardBodies,
      tabularSample,
      tabularSamples,
      liveSurface,
      // Additive keys: new names only, every key above is unchanged.
      filterGroups,
      matchesGrid,
      tournamentsGrid,
      matchCard,
      bracket,
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
        navItemFontSize: "13px",
        navItemFontWeight: 600,
        sidebarPadding: "20px 14px",
        pageHeadingFontSize: "28px",
        pageHeadingFontWeight: 900,
        pageHeadingLineHeight: "28px",
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
