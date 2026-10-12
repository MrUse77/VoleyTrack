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

// ESCAPING RULE FOR EVERYTHING BELOW. `PROBE_SOURCE` is a template literal, so a single
// backslash is CONSUMED by the template before `evaluate()` ever sees it: a pattern written with
// one backslash before the `s` reaches the page as `/s+/g`, and the probe then rewrites the letter
// "s" out of every label it reports. Two fields did exactly that (`adminTournamentCards[].figures`
// and `adminTournamentTabs[].tabs[].label`, the `"equipos"` -> `"equipo "` corruption). Every
// regex escape inside this literal is therefore written with a doubled backslash. When adding a
// probe, re-check the literal for odd-length backslash runs: a run of 2n backslashes yields n
// escaped characters, while an odd run leaves its last backslash escaping the next character.
const PROBE_SOURCE = `(async () => {
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

  // Additive only. The design's public sidebar carries six destinations
  // (frontend/design/html/voleytrack.html, its sidebar-public-nav group); the app adds them
  // one at a
  // time as each screen becomes real, so the rendered label list is what proves which
  // destinations exist. Reading the label span rather than the whole anchor keeps the
  // numeric icon prefix out of the value.
  const navDestinations = Array.from(document.querySelectorAll("aside nav a")).map((link) => ({
    label: (link.querySelector("span:last-child")?.textContent || "").trim(),
    href: link.getAttribute("href"),
    isActive: link.getAttribute("aria-current") === "page",
  }));

  // Additive only. The design's list tables are thead > tr > th cells
  // (voleytrack.css:96) and the shared DataTable primitive renders every header as
  // a scoped column header; this reports the header semantics actually rendered instead of the
  // class names that produced them.
  const tableHeaders = Array.from(document.querySelectorAll("table")).map((table) => ({
    columnHeaders: table.querySelectorAll('th[scope="col"]').length,
    rowHeaders: table.querySelectorAll('th[scope="row"]').length,
    headers: Array.from(table.querySelectorAll('th[scope="col"]')).map((th) =>
      (th.textContent || "").trim().replace(/\\s+/g, " "),
    ),
  }));

  // Additive only. The team detail's tab strip is a labelled navigation whose entries are
  // route links; reporting each entry's label plus the active entry's computed box proves the
  // design's four-tab set (Detalle, Plantel (n), Partidos, Estadisticas) and its active
  // treatment rendered.
  const teamTabsElement = document.querySelector('[data-testid="team-tabs"]');
  const teamTabs = teamTabsElement
    ? Array.from(teamTabsElement.querySelectorAll("a")).map((tab) => {
        const cs = getComputedStyle(tab);
        return {
          label: (tab.textContent || "").trim().replace(/\\s+/g, " "),
          href: tab.getAttribute("href"),
          isActive: tab.getAttribute("aria-current") === "page",
          backgroundColor: cs.backgroundColor,
          color: cs.color,
          borderRadius: cs.borderRadius,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
        };
      })
    : null;

  // Additive only. The design's .kpi-grid is four columns (two below 1200px,
  // voleytrack-jugadores.css:3-4) and its .kpi-value is 32px/900 with line-height 1
  // (lines 8-9). KpiGrid/Kpi declare role="list"/"listitem", so the grid is found
  // through its accessible role and the resolved tracks and value typography are reported.
  const kpiGridElement = document.querySelector('[role="list"]');
  const kpiValueElement = kpiGridElement
    ? kpiGridElement.querySelector('[role="listitem"] p:nth-of-type(2)')
    : null;
  const kpiGrid = kpiGridElement
    ? (() => {
        const cs = getComputedStyle(kpiGridElement);
        const valueStyle = kpiValueElement ? getComputedStyle(kpiValueElement) : null;
        return {
          label: kpiGridElement.getAttribute("aria-label"),
          childCount: kpiGridElement.querySelectorAll('[role="listitem"]').length,
          gridTemplateColumns: cs.gridTemplateColumns,
          columnGap: cs.columnGap,
          value: valueStyle
            ? {
                text: (kpiValueElement.textContent || "").trim(),
                fontSize: valueStyle.fontSize,
                fontWeight: valueStyle.fontWeight,
                lineHeight: valueStyle.lineHeight,
                letterSpacing: valueStyle.letterSpacing,
              }
            : null,
        };
      })()
    : null;

  // Additive only: no key, strategy, order or shape above is renamed, reordered or
  // redefined. The live match screen is the one screen whose whole content is a scoreboard,
  // a court and a timeline, and the existing tabularSamples/cardBodies keys only see it
  // through treatments it may or may not use. This key reports what the screen itself
  // renders: the resolved box and fill of each region that survives on both sides of the
  // live alignment, the typography actually applied to the current-set score, the court's
  // structure and its per-position accessible names, and the timeline's element and item
  // count. Every selector here exists on the pre-alignment screen too, so the same probe can
  // measure before and after.
  const describeLiveBox = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      testId: el.getAttribute("data-testid"),
      tag: el.tagName.toLowerCase(),
      paddingTop: cs.paddingTop,
      paddingRight: cs.paddingRight,
      paddingBottom: cs.paddingBottom,
      paddingLeft: cs.paddingLeft,
      borderRadius: cs.borderTopLeftRadius,
      backgroundColor: cs.backgroundColor,
      backgroundImage: cs.backgroundImage === "none" ? null : cs.backgroundImage,
      gridTemplateColumns: cs.gridTemplateColumns,
    };
  };
  const describeLiveText = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      tag: el.tagName.toLowerCase(),
      text: (el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 48),
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      letterSpacing: cs.letterSpacing,
      fontVariantNumeric: cs.fontVariantNumeric,
    };
  };
  const liveRegionIds = [
    "live-match-scoreboard",
    "set-history-card",
    "court-rotations",
    "court-graphic",
    "live-events",
    "team-statistics",
    "top-scorers",
    "roster-grid",
    "individual-stats",
    "match-metadata",
  ];
  const liveCourtElement = document.querySelector('[data-testid="court-graphic"]');
  const liveTimelineElement =
    document.querySelector('[data-testid="live-event-list"]') ??
    document.querySelector('[data-testid="live-events"] ol');
  const liveEventItems = Array.from(document.querySelectorAll('[data-testid="live-event"]'));
  const liveCourtPositions = Array.from(document.querySelectorAll('[data-testid="court-position"]'));
  const liveScoreElement = document.querySelector('[data-testid="current-score-home"]');
  const liveScoreboardElement = document.querySelector('[data-testid="live-match-scoreboard"]');
  const liveScreen =
    liveScoreboardElement || liveCourtElement || liveTimelineElement
      ? {
          scoreboard: describeLiveBox(liveScoreboardElement),
          currentScore: describeLiveText(liveScoreElement),
          currentScoreParent: describeLiveText(liveScoreElement?.parentElement ?? null),
          court: liveCourtElement
            ? (() => {
                const courtRect = liveCourtElement.getBoundingClientRect();
                const boxes = liveCourtPositions.map((el) => {
                  const r = el.getBoundingClientRect();
                  return {
                    position: el.getAttribute("data-position"),
                    left: round(r.left - courtRect.left),
                    top: round(r.top - courtRect.top),
                    width: round(r.width),
                    height: round(r.height),
                  };
                });
                const overflowing = boxes.filter(
                  (box) =>
                    box.left < 0 ||
                    box.top < 0 ||
                    box.left + box.width > round(courtRect.width) ||
                    box.top + box.height > round(courtRect.height),
                );

                return {
                  ...describeLiveBox(liveCourtElement),
                  role: liveCourtElement.getAttribute("role"),
                  ariaDescribedBy: liveCourtElement.getAttribute("aria-describedby"),
                  netCount: liveCourtElement.querySelectorAll('[data-testid="volleyball-net"]').length,
                  attackLineCount: liveCourtElement.querySelectorAll('[data-testid="attack-line"]').length,
                  positionCount: document.querySelectorAll('[data-testid="court-position"]').length,
                  positionLabels: liveCourtPositions
                    .slice(0, 3)
                    .map((el) => el.getAttribute("aria-label")),
                  positionTexts: liveCourtPositions
                    .slice(0, 3)
                    .map((el) => (el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 40)),
                  boxWidth: round(courtRect.width),
                  boxHeight: round(courtRect.height),
                  positionBoxes: boxes.slice(0, 4),
                  overflowingPositionCount: overflowing.length,
                };
              })()
            : null,
          timeline: liveTimelineElement
            ? {
                tag: liveTimelineElement.tagName.toLowerCase(),
                testId: liveTimelineElement.getAttribute("data-testid"),
                itemCount: liveEventItems.length,
                listItemTags: [...new Set(liveEventItems.map((el) => el.tagName.toLowerCase()))],
              }
            : null,
          regions: liveRegionIds
            .map((id) => document.querySelector('[data-testid="' + id + '"]'))
            .filter(Boolean)
            .map(describeLiveBox),
        }
      : null;

  const expected = __EXPECTED__;
  const innerText = document.body.innerText || "";
  const expectedStrings = expected.map((value) => ({ value, found: innerText.includes(value) }));

  const root = document.getElementById("root");
  const overlay = document.querySelector("vite-error-overlay, #vite-error-overlay, .vite-error-overlay");

  // Additive only: a dedicated computed-style handle for the sidebar's surface and divider,
  // so the new keys below can read them without touching the calls the existing keys use.
  const sidebarStyle = sidebar.el ? getComputedStyle(sidebar.el) : null;

  // ---------------------------------------------------------------------------------------
  // Additive: admin design-alignment probes. New keys only - every key above keeps its name,
  // order and shape, and the wrapper stays one IIFE (now async, so a probe can wait for a
  // React re-render) whose resolved value is the same report object.
  // ---------------------------------------------------------------------------------------
  const describeBox = (el) => {
    if (!el) return null;

    const cs = getComputedStyle(el);

    return {
      tag: el.tagName.toLowerCase(),
      type: el.getAttribute("type"),
      id: el.id || null,
      height: cs.height,
      width: round(el.getBoundingClientRect().width),
      borderRadius: cs.borderTopLeftRadius,
      borderColor: cs.borderTopColor,
      backgroundColor: cs.backgroundColor,
      boxShadow: cs.boxShadow,
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
    };
  };

  // The design's form control spec (frontend/design/html/voleytrack-admin.css:180-185): 46px
  // tall, a 12px radius, a --border edge on the --bg fill, and a focus-visible treatment of a
  // --accent edge plus a 3px accent-soft ring. The first visible control inside <main> is
  // measured unfocused and focused (then blurred again), and its label / aria-describedby /
  // aria-invalid wiring is reported so the field contract is readable without an image.
  const formControlElement = Array.from(
    document.querySelectorAll("main input:not([type=hidden]), main select, main textarea"),
  ).find((el) => el.closest("[hidden]") === null && el.getBoundingClientRect().height > 0) ?? null;
  const describedById = formControlElement?.getAttribute("aria-describedby")?.split(/\\s+/)[0] ?? null;

  // The design's input, select and textarea share one rule, so the same box is reported per
  // tag: a route whose select still carries the app's old 40px/8px treatment is then visible
  // next to its 46px/12px input instead of being hidden behind "first control".
  const firstControlOf = (selector) =>
    Array.from(document.querySelectorAll(selector)).find(
      (el) => el.closest("[hidden]") === null && el.getBoundingClientRect().height > 0,
    ) ?? null;
  const controlBoxes = [
    ["input", firstControlOf("main input:not([type=hidden])")],
    ["select", firstControlOf("main select")],
    ["textarea", firstControlOf("main textarea")],
  ]
    .filter(([, el]) => el)
    .map(([kind, el]) => ({ kind, ...describeBox(el) }));

  // A script-initiated focus() does not set Chromium's keyboard-interaction flag, so
  // :focus-visible never matches here and the painted ring cannot be observed from the page.
  // The rule the browser actually loaded is therefore read out of the CSSOM instead: the
  // declared border colour and box-shadow of every :focus-visible rule the probed control's
  // classes match. Those are the design's own
  // border-color:var(--accent) plus box-shadow:0 0 0 3px color-mix(...22%...) (admin.css:185).
  const collectFocusRules = (element) => {
    if (!element) return [];
    const found = [];
    // Tailwind v4 emits the focus-visible variants as a nested rule, so a rule's own selector
    // just an ampersand plus :focus-visible; the parent selector is threaded through and
    // substituted back in before the selector is matched against the control's classes.
    const walk = (rules, parentSelector) => {
      for (const rule of rules) {
        const selectorText = rule.selectorText
          ? rule.selectorText.replace(/&/g, parentSelector ?? "")
          : null;

        if (rule.cssRules) walk(rule.cssRules, selectorText ?? parentSelector);

        if (!selectorText || !rule.style || !/:focus-visible/.test(selectorText)) continue;

        const baseSelectors = selectorText
          .split(",")
          .map((selector) => selector.replace(/:focus-visible/g, ""))
          .filter(Boolean);
        const matches = baseSelectors.some((selector) => {
          try {
            return element.matches(selector);
          } catch {
            return false;
          }
        });

        if (matches && (rule.style.boxShadow || rule.style.borderColor || rule.style.getPropertyValue("--tw-shadow"))) {
          found.push({
            selector: selectorText,
            borderColor: rule.style.borderColor,
            boxShadow: rule.style.boxShadow,
            // Tailwind v4 composes its shadows through --tw-shadow, so the ring is declared
            // there rather than in a box-shadow longhand.
            twShadow: rule.style.getPropertyValue("--tw-shadow"),
          });
        }
      }
    };

    for (const sheet of document.styleSheets) {
      let rules = null;
      try {
        rules = sheet.cssRules;
      } catch {
        rules = null;
      }

      if (rules) walk(rules, null);
    }

    return found.slice(0, 4);
  };

  const formControl = formControlElement
    ? (() => {
        const label = formControlElement.id
          ? document.querySelector('label[for="' + formControlElement.id + '"]')
          : null;
        const previouslyActive = document.activeElement;
        const unfocused = describeBox(formControlElement);
        formControlElement.focus();
        const focused = describeBox(formControlElement);
        const focusVisible = formControlElement.matches(":focus-visible");
        // Restore rather than blur: blurring would move focus to <body> and make a later probe
        // report that the dialog's own focus had been lost.
        if (previouslyActive instanceof HTMLElement && previouslyActive !== formControlElement) {
          previouslyActive.focus();
        } else if (!(previouslyActive instanceof HTMLElement)) {
          formControlElement.blur();
        }

        return {
          labelText: label ? (label.textContent || "").trim() : null,
          ariaDescribedBy: formControlElement.getAttribute("aria-describedby"),
          describedByText: describedById
            ? (document.getElementById(describedById)?.textContent || "").trim().slice(0, 80)
            : null,
          ariaInvalid: formControlElement.getAttribute("aria-invalid"),
          unfocused,
          focused,
          focusVisible,
          focusRules: collectFocusRules(formControlElement),
          controls: controlBoxes,
        };
      })()
    : null;

  // The design's dialog (voleytrack-admin.css:244-254): role=dialog, aria-modal, a head with
  // the title, the mono eyebrow and the round close control, a body and a foot. The focus trap
  // is measured for real: the dialog's last focusable is focused and a Tab keydown is
  // dispatched, which the primitive must answer by wrapping focus back to the first focusable.
  const describeDialog = (dialog) => {
    const focusable = Array.from(
      dialog.querySelectorAll(
        "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
      ),
    ).filter((el) => el.closest("[hidden]") === null);
    const labelledBy = dialog.getAttribute("aria-labelledby");
    const describedBy = dialog.getAttribute("aria-describedby");
    const closeControl = dialog.querySelector("button[aria-label]");
    const initialActive = document.activeElement;
    let tabWrapsToFirst = null;

    if (focusable.length > 1) {
      focusable[focusable.length - 1].focus();
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }),
      );
      tabWrapsToFirst = document.activeElement === focusable[0];
    }

    const report = {
      role: dialog.getAttribute("role"),
      ariaModal: dialog.getAttribute("aria-modal"),
      labelledByText: labelledBy ? (document.getElementById(labelledBy)?.textContent || "").trim() : null,
      describedByText: describedBy ? (document.getElementById(describedBy)?.textContent || "").trim() : null,
      closeLabel: closeControl ? closeControl.getAttribute("aria-label") : null,
      focusableCount: focusable.length,
      focusStartsInside: dialog.contains(initialActive),
      tabWrapsToFirst,
      panel: describeBox(dialog),
      bodyPadding: getComputedStyle(dialog.querySelector("div:nth-of-type(2)") ?? dialog).padding,
    };

    if (initialActive instanceof HTMLElement) initialActive.focus();

    return report;
  };
  const modals = Array.from(document.querySelectorAll('[role="dialog"][aria-modal="true"]')).map(
    describeDialog,
  );

  // The design's collapsible filter panel (voleytrack-admin-jugadores.html:44,
  // voleytrack-admin-partidos.html:38): a button carrying aria-expanded/aria-controls over a
  // card that starts hidden and stays in the DOM.
  const filterPanels = Array.from(
    document.querySelectorAll("main [aria-controls][aria-expanded]"),
  ).map((toggle) => {
    const panel = document.getElementById(toggle.getAttribute("aria-controls"));

    return {
      toggleLabel: (toggle.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 40),
      expanded: toggle.getAttribute("aria-expanded"),
      controls: toggle.getAttribute("aria-controls"),
      panelPresent: Boolean(panel),
      panelHidden: panel ? panel.hasAttribute("hidden") : null,
      controlCount: panel ? panel.querySelectorAll("input, select, textarea").length : 0,
    };
  });

  // The design's result count (the .hint line with aria-live) and its empty state. The empty
  // state is
  // measured by pointing the list's first filter select at a value no row can match, waiting
  // for the re-render, reading the DOM, and restoring the original value - so the capture that
  // follows still shows the populated screen.
  const listRoot = document.querySelector("main table") ?? document.querySelector("main ul");
  // Only the design's collapsible filter panel drives the list, so the forced-empty measurement
  // must not grab a control that belongs to a dialog or a form.
  const listSelect = document.querySelector("main [id$='-filter-panel'] select");
  const liveRegions = Array.from(document.querySelectorAll("main [aria-live]")).map((el) => ({
    text: (el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 80),
    ariaLive: el.getAttribute("aria-live"),
    role: el.getAttribute("role"),
  }));
  const listStates = {
    liveRegions,
    initialRowCount: listRoot ? listRoot.querySelectorAll("tbody tr, :scope > li").length : null,
    emptyStateShown: null,
    emptyStateText: null,
    restoredRowCount: null,
  };

  if (listRoot && listSelect) {
    const originalValue = listSelect.value;
    const probeOption = document.createElement("option");
    probeOption.value = "__probe__";
    probeOption.textContent = "\u2014";
    listSelect.append(probeOption);
    listSelect.value = "__probe__";
    listSelect.dispatchEvent(new Event("change", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 80));

    const emptyStateElement = document.querySelector("main [role='status']");
    listStates.emptyStateShown = document.querySelector("main table, main ul") === null;
    listStates.emptyStateText = emptyStateElement
      ? (emptyStateElement.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 120)
      : null;

    listSelect.value = originalValue;
    listSelect.dispatchEvent(new Event("change", { bubbles: true }));
    await new Promise((resolve) => setTimeout(resolve, 80));
    listSelect.removeChild(probeOption);
    listStates.restoredRowCount = document.querySelectorAll("main tbody tr, main ul > li").length;
  }

  // ---------------------------------------------------------------------------------------
  // Additive: the admin tournament area's own probes. New keys only - every key above keeps its
  // name, order and shape, and no existing strategy is reordered or redefined.
  // ---------------------------------------------------------------------------------------

  // The design's admin list card (a.card.clickable.tournament-card,
  // frontend/design/html/voleytrack-admin-torneos.html): a link whose body prints a mono
  // uppercase "TIPO . ESTADO" eyebrow, the name, the figures line and a badge row. Reporting the
  // rendered box, the copy and the destination makes the card's padding, its link semantics and
  // its data-driven content machine-readable instead of only visual.
  const adminTournamentCards = Array.from(
    document.querySelectorAll('[data-testid="admin-tournament-card"]'),
  ).map((card) => {
    const body = card.querySelector('[data-testid="admin-tournament-card-body"]');
    const cs = body ? getComputedStyle(body) : null;

    return {
      tag: card.tagName.toLowerCase(),
      href: card.getAttribute("href"),
      ariaLabel: card.getAttribute("aria-label"),
      eyebrow: (card.querySelector("small")?.textContent || "").trim(),
      heading: (card.querySelector("h3")?.textContent || "").trim(),
      figures: (card.querySelector("p")?.textContent || "").trim().replace(/\\s+/g, " "),
      badgeCount: card.querySelectorAll("span[class*='rounded-full']").length,
      badges: Array.from(card.querySelectorAll("span[class*='rounded-full']")).map((badge) =>
        (badge.textContent || "").trim(),
      ),
      bodyPaddingTop: cs ? cs.paddingTop : null,
      bodyPaddingLeft: cs ? cs.paddingLeft : null,
      bodyBorderRadius: cs ? cs.borderTopLeftRadius : null,
      bodyBackgroundColor: cs ? cs.backgroundColor : null,
    };
  });

  // The admin tournament frame's regions, found through the test ids the shared
  // TournamentDetailShell and the admin panels already declare. This is what proves the
  // design's page-head / KPI / Informacion / tabs / panel order actually rendered on a route,
  // and it is the same set of selectors on every admin tournament route.
  const adminTournamentRegionIds = [
    "tournament-detail-content",
    "tournament-info-card-body",
    "tournament-format-card-body",
    "tournament-tabs",
    "tournament-tab-panel",
    "tournament-form-card-body",
    "tournaments-filter-card-body",
    "tournament-bracket",
  ];
  const adminTournamentRegions = adminTournamentRegionIds
    .map((testId) => {
      const el = document.querySelector('[data-testid="' + testId + '"]');
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        testId,
        tag: el.tagName.toLowerCase(),
        childCount: el.childElementCount,
        padding: cs.padding,
        backgroundColor: cs.backgroundColor,
        borderRadius: cs.borderTopLeftRadius,
      };
    })
    .filter(Boolean);

  // The design's .info-row list (voleytrack-admin.css:119-122) inside the Informacion card and
  // the cup's Formato card: one row per attribute, each with its label and value. Counting them
  // proves the overview renders the design's own block and how many rows the derived Formato
  // card carries.
  const describeInfoRows = (testId) => {
    const body = document.querySelector('[data-testid="' + testId + '"]');
    if (!body) return null;

    const rows = Array.from(body.children);

    return {
      testId,
      count: rows.length,
      rows: rows.map((row) => ({
        label: (row.children[0]?.textContent || "").trim(),
        value: (row.children[1]?.textContent || "").trim(),
      })),
      paddingTop: getComputedStyle(body).paddingTop,
      paddingLeft: getComputedStyle(body).paddingLeft,
    };
  };
  const infoRows = {
    format: describeInfoRows("tournament-format-card-body"),
    informacion: describeInfoRows("tournament-info-card-body"),
  };

  // The .tournament-tabs strip (frontend/design/html/voleytrack-admin-ver-torneo.html,
  // role="tablist" there). Here every entry is a route link, so the key reports each label,
  // its destination, whether it is the current page (aria-current), and the active entry's
  // resolved treatment - which is how the tab set and its state are read without an image.
  const adminTournamentTabsElement = document.querySelector('[data-testid="tournament-tabs"]');
  const adminTournamentTabs = adminTournamentTabsElement
    ? {
        ariaLabel: adminTournamentTabsElement.getAttribute("aria-label"),
        tabCount: adminTournamentTabsElement.querySelectorAll("a").length,
        tabs: Array.from(adminTournamentTabsElement.querySelectorAll("a")).map((tab) => {
          const cs = getComputedStyle(tab);
          return {
            label: (tab.textContent || "").trim().replace(/\\s+/g, " "),
            href: tab.getAttribute("href"),
            isCurrent: tab.getAttribute("aria-current") === "page",
            backgroundColor: cs.backgroundColor,
            color: cs.color,
            borderRadius: cs.borderRadius,
            height: cs.height,
          };
        }),
      }
    : null;

  // Additive: the admin team area's own probes. New keys only - every key above keeps its name,
  // order and shape, and no existing strategy is reordered or redefined.
  //
  // The create screen's inline roster builder (frontend/design/html/voleytrack-admin-crear-equipo.html,
  // the .squad-list of .squad-item chips): each chip carries the player, its .squad-remove
  // affordance and that affordance's accessible name, and the empty state is reported next to
  // them, so the builder's structure and its count of removable entries are readable without an
  // image.
  const squadItems = Array.from(
    document.querySelectorAll('[data-testid="create-team-squad-item"]'),
  ).map((item) => {
    const remove = item.querySelector("button");
    return {
      text: (item.textContent || "").trim().replace(/\\s+/g, " "),
      removeLabel: remove ? remove.getAttribute("aria-label") : null,
      removeTag: remove ? remove.tagName.toLowerCase() : null,
    };
  });
  const squadEmpty = document.querySelector(
    '[data-testid="create-team-roster-card-body"] [role="status"]',
  );
  const adminTeamSquad = {
    listPresent: document.querySelector('[data-testid="create-team-squad-list"]') !== null,
    itemCount: squadItems.length,
    items: squadItems,
    emptyStateText: squadEmpty
      ? (squadEmpty.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 120)
      : null,
  };
  // Drive the builder once so the count of removable entries is a measured value rather than a
  // structural guess: open the design's dialog, fill its three fields, submit, read the chips,
  // then remove the chip again so the capture still shows the screen's own opening state. The
  // driver is defensive: on any other route there is no "Agregar jugador" button and the run
  // reports nulls.
  const adminTeamSquadRun = {
    modalOpened: null,
    addedItemCount: null,
    removeLabels: [],
    restoredItemCount: null,
  };
  const addPlayerButton = Array.from(document.querySelectorAll("main button")).find(
    (button) => (button.textContent || "").trim() === "Agregar jugador",
  );
  if (addPlayerButton) {
    try {
      addPlayerButton.click();
      await new Promise((resolve) => setTimeout(resolve, 80));
      const dialog = document.querySelector('[role="dialog"][aria-modal="true"]');
      adminTeamSquadRun.modalOpened = Boolean(dialog);
      const form = dialog ? dialog.querySelector("form") : null;
      if (form) {
        const setValue = (el, value) => {
          const proto = el.tagName === "SELECT" ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
          Object.getOwnPropertyDescriptor(proto, "value").set.call(el, value);
          el.dispatchEvent(new Event(el.tagName === "SELECT" ? "change" : "input", { bubbles: true }));
        };
        const fields = form.querySelectorAll("input, select");
        setValue(fields[0], "Jugadora de prueba");
        setValue(fields[1], "9");
        setValue(fields[2], "Central");
        await new Promise((resolve) => setTimeout(resolve, 40));
        form.requestSubmit();
        await new Promise((resolve) => setTimeout(resolve, 80));
        adminTeamSquadRun.addedItemCount = document.querySelectorAll(
          '[data-testid="create-team-squad-item"]',
        ).length;
        adminTeamSquadRun.removeLabels = Array.from(
          document.querySelectorAll('[data-testid="create-team-squad-item"] button'),
        ).map((button) => button.getAttribute("aria-label"));
        const remove = document.querySelector('[data-testid="create-team-squad-item"] button');
        if (remove) remove.click();
        await new Promise((resolve) => setTimeout(resolve, 80));
        adminTeamSquadRun.restoredItemCount = document.querySelectorAll(
          '[data-testid="create-team-squad-item"]',
        ).length;
      }
    } catch (error) {
      adminTeamSquadRun.error = String(error && error.message ? error.message : error);
    }
  }
  adminTeamSquad.run = adminTeamSquadRun;

  // The admin team detail's own frame (frontend/design/html/voleytrack-admin-ver-equipo.html):
  // the page head, the .detail-tabs strip and the active panel, found through the test ids
  // the new routes declare. Reporting them proves the route resolved with its regions, and the
  // tab key reports each label, its destination and the current entry.
  const adminTeamRegionIds = [
    "admin-team-detail-content",
    "admin-team-tabs",
    "admin-team-tab-panel",
    "admin-team-overview-grid",
    "admin-team-performance-card-body",
    "admin-team-matches-card-body",
    "admin-team-stats-card-body",
    "admin-team-top-players-card-body",
  ];
  const adminTeamRegions = adminTeamRegionIds
    .map((testId) => {
      const el = document.querySelector('[data-testid="' + testId + '"]');
      if (!el) return null;
      const cs = getComputedStyle(el);
      return {
        testId,
        tag: el.tagName.toLowerCase(),
        childCount: el.childElementCount,
        padding: cs.padding,
        backgroundColor: cs.backgroundColor,
        borderRadius: cs.borderTopLeftRadius,
      };
    })
    .filter(Boolean);
  const adminTeamTabsElement = document.querySelector('[data-testid="admin-team-tabs"]');
  const adminTeamTabs = adminTeamTabsElement
    ? {
        ariaLabel: adminTeamTabsElement.getAttribute("aria-label"),
        tabCount: adminTeamTabsElement.querySelectorAll("a").length,
        tabs: Array.from(adminTeamTabsElement.querySelectorAll("a")).map((tab) => {
          const cs = getComputedStyle(tab);
          return {
            label: (tab.textContent || "").trim(),
            href: tab.getAttribute("href"),
            isCurrent: tab.getAttribute("aria-current") === "page",
            backgroundColor: cs.backgroundColor,
            color: cs.color,
            borderRadius: cs.borderRadius,
            height: cs.height,
          };
        }),
      }
    : null;

  // Additive: the planillero area's own probes. New keys only - every key above keeps its name,
  // order and shape, no existing strategy is reordered or redefined, and the exit codes are
  // untouched. Both keys are null off the planillero routes, so every other capture is unchanged.
  //
  // The design models exactly two regions there (frontend/design/html/voleytrack-planillero.html):
  // #assigned-view is a .match-list of .match-card.match-select rows (16px 18px padding, a 1px
  // --border edge, a 14px radius on --surface, minmax(0,1fr) auto auto tracks at an 18px gap) and
  // #setup-view is a .card whose .card-b holds the .setup-grid (1fr auto 1fr, 18px gap) around a
  // .setup-versus separator, over the .form-actions row with the accent "Iniciar partido" control.
  // Reading the resolved tracks, boxes, typography and the control's destination makes both regions
  // machine-readable without an image.
  const describeMatchRow = (row) => {
    const cs = getComputedStyle(row);
    const title = row.querySelector("h2");
    return {
      tag: row.tagName.toLowerCase(),
      matchId: row.getAttribute("data-match-id"),
      href: row.getAttribute("href"),
      title: title ? (title.textContent || "").trim() : null,
      meta: (row.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 80),
      status: row.querySelector("[data-status]")?.getAttribute("data-status") ?? null,
      paddingTop: cs.paddingTop,
      paddingLeft: cs.paddingLeft,
      borderRadius: cs.borderTopLeftRadius,
      borderColor: cs.borderTopColor,
      backgroundColor: cs.backgroundColor,
      display: cs.display,
      gridTemplateColumns: cs.gridTemplateColumns,
    };
  };
  const assignedListElement = document.querySelector('[data-testid="planillero-assigned-matches"]');
  const planilleroAssigned = assignedListElement
    ? {
        present: true,
        tag: assignedListElement.tagName.toLowerCase(),
        ariaLabel: assignedListElement.getAttribute("aria-label"),
        itemCount: assignedListElement.querySelectorAll(":scope > li").length,
        rows: Array.from(assignedListElement.querySelectorAll("[data-match-id]")).map(describeMatchRow),
      }
    : {
        present: false,
        // The design's other branch: .card.empty-state (#assigned-empty) with role="status".
        emptyStateText: (() => {
          const empty = document.querySelector('[data-testid="planillero-screen"] [role="status"]');
          return empty ? (empty.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 120) : null;
        })(),
      };
  const setupGridElement = document.querySelector('[data-testid="planillero-setup-grid"]');
  const planilleroSetup = setupGridElement
    ? (() => {
        const gridStyle = getComputedStyle(setupGridElement);
        const versus = document.querySelector('[data-testid="planillero-setup-versus"]');
        const versusStyle = versus ? getComputedStyle(versus) : null;
        const actions = document.querySelector('[data-testid="planillero-setup-actions"]');
        const actionsStyle = actions ? getComputedStyle(actions) : null;
        const cta = document.querySelector('[data-testid="planillero-start-match"]');
        const ctaStyle = cta ? getComputedStyle(cta) : null;
        const cardBody = document.querySelector('[data-testid="planillero-setup-card-body"]');
        const cardBodyStyle = cardBody ? getComputedStyle(cardBody) : null;
        return {
          heading: (document.querySelector('[data-testid="planillero-screen"] h1')?.textContent || "").trim(),
          eyebrow: (document.querySelector('[data-testid="planillero-screen"] p')?.textContent || "").trim(),
          // The pageHeading.description key above reads the FIRST p of the heading's container, which
          // is now the design's eyebrow, so the page-head meta line the design renders below the h1
          // is reported here by name rather than left unmeasured.
          meta: (
            document.querySelector('[data-testid="planillero-screen"] header > div > p:last-of-type')
              ?.textContent || ""
          ).trim(),
          gridTemplateColumns: gridStyle.gridTemplateColumns,
          columnGap: gridStyle.columnGap,
          textAlign: gridStyle.textAlign,
          teams: Array.from(
            setupGridElement.querySelectorAll('[data-testid="planillero-setup-team"]'),
          ).map((team) => {
            const cs = getComputedStyle(team);
            return {
              text: (team.textContent || "").trim(),
              paddingTop: cs.paddingTop,
              paddingLeft: cs.paddingLeft,
              borderRadius: cs.borderTopLeftRadius,
              borderColor: cs.borderTopColor,
              backgroundColor: cs.backgroundColor,
              fontSize: cs.fontSize,
              fontWeight: cs.fontWeight,
            };
          }),
          versus: versusStyle
            ? {
                text: (versus.textContent || "").trim(),
                fontFamily: versusStyle.fontFamily,
                fontSize: versusStyle.fontSize,
                fontWeight: versusStyle.fontWeight,
                textTransform: versusStyle.textTransform,
                color: versusStyle.color,
              }
            : null,
          actions: actionsStyle
            ? {
                display: actionsStyle.display,
                justifyContent: actionsStyle.justifyContent,
                marginTop: actionsStyle.marginTop,
                paddingTop: actionsStyle.paddingTop,
                borderTopWidth: actionsStyle.borderTopWidth,
                borderTopColor: actionsStyle.borderTopColor,
              }
            : null,
          cardBodyPadding: cardBodyStyle
            ? {
                paddingTop: cardBodyStyle.paddingTop,
                paddingRight: cardBodyStyle.paddingRight,
                paddingBottom: cardBodyStyle.paddingBottom,
                paddingLeft: cardBodyStyle.paddingLeft,
              }
            : null,
          startMatch: ctaStyle
            ? {
                tag: cta.tagName.toLowerCase(),
                text: (cta.textContent || "").trim(),
                href: cta.getAttribute("href"),
                height: ctaStyle.height,
                borderRadius: ctaStyle.borderRadius,
                backgroundColor: ctaStyle.backgroundColor,
                color: ctaStyle.color,
                fontSize: ctaStyle.fontSize,
                fontWeight: ctaStyle.fontWeight,
              }
            : null,
          // The design puts no form control on this screen at all (#setup-home / #setup-away are
          // plain text blocks), so the count is reported rather than left implicit.
          formControlCount: document.querySelectorAll(
            'main input:not([type=hidden]), main select, main textarea',
          ).length,
        };
      })()
    : null;

  // Additive: the login screen's own probes. New keys only - every key above keeps its name,
  // order and shape, no existing strategy is reordered or redefined, and the exit codes are
  // untouched. The key is null off the login route, so every other capture is unchanged.
  //
  // Design: frontend/design/html/voleytrack-login.html. The .login-wrap rule is
  // display:grid with grid-template-columns 640px 1fr and min-height 100vh (line 42), whose
  // first column is .branding - the --surface fill with a 1px --border right edge and 80px
  // padding (line 43), a 48px/900 -0.03em wordmark beside a 54px mark (lines 44-45) and a
  // 16px --muted claim capped at 32ch (line 46) - and whose second is .form-col (centred,
  // 40px padding, the --bg canvas, line 50) holding a 480px .form-box (line 51) with a
  // 32px/900 -0.02em heading (line 52), a 14px --muted sub with an 8px/32px vertical margin
  // (line 53), 48px/10px controls (line 57) and the 48px/10px accent submit with its #0b1220
  // ink (line 58). Reading the resolved columns, boxes, typography, control geometry and the
  // submit's fill and ink makes the alignment machine-readable without an image.
  // The gate is the screen's own email field id, which both the pre-alignment screen and
  // the aligned one render, so the same key reports the before and the after of this work
  // instead of appearing only after the change.
  const loginEmailControl = document.querySelector("#login-email");
  const loginScreenElement = loginEmailControl ? loginEmailControl.closest("main") : null;
  const loginScreen = loginScreenElement
    ? (() => {
        const boxOf = (el) => {
          if (!el) return null;
          const cs = getComputedStyle(el);
          return {
            ...rect(el),
            paddingTop: cs.paddingTop,
            paddingRight: cs.paddingRight,
            paddingBottom: cs.paddingBottom,
            paddingLeft: cs.paddingLeft,
            backgroundColor: cs.backgroundColor,
            borderRightWidth: cs.borderRightWidth,
            borderRightColor: cs.borderRightColor,
            display: cs.display,
            flexDirection: cs.flexDirection,
            justifyContent: cs.justifyContent,
          };
        };
        const textOf = (el) => (el ? (el.textContent || "").trim().replace(/\\s+/g, " ") : null);
        const typographyOf = (el) => {
          if (!el) return null;
          const cs = getComputedStyle(el);
          return {
            text: textOf(el),
            fontSize: cs.fontSize,
            fontWeight: cs.fontWeight,
            lineHeight: cs.lineHeight,
            letterSpacing: cs.letterSpacing,
            color: cs.color,
            marginTop: cs.marginTop,
            marginBottom: cs.marginBottom,
            maxWidth: cs.maxWidth,
          };
        };
        const branding = loginScreenElement.querySelector("section");
        const brandStats = loginScreenElement.querySelectorAll('[data-testid="login-brand-stat"]');
        const heading = loginScreenElement.querySelector("h1");
        const submit = loginScreenElement.querySelector('button[type="submit"]');
        const submitStyle = submit ? getComputedStyle(submit) : null;
        const errors = Array.from(loginScreenElement.querySelectorAll('[role="alert"]')).map(textOf);
        return {
          columns: {
            gridTemplateColumns: getComputedStyle(loginScreenElement).gridTemplateColumns,
            minHeight: getComputedStyle(loginScreenElement).minHeight,
            children: Array.from(loginScreenElement.children).map((child) => ({
              testId: child.getAttribute("data-testid"),
              ...boxOf(child),
            })),
          },
          branding: branding
            ? {
                ...boxOf(branding),
                // The first and last element children are the mark/wordmark block and the
                // claim in both the pre-alignment panel and the design's panel.
                logo: typographyOf(branding.firstElementChild),
                claim: typographyOf(branding.lastElementChild),
              }
            : { present: false },
          // The design's login stylesheet declares .brand-stats (lines 47-49) but its
          // markup renders no such element (lines 73-74 are the logo and the claim), so the
          // count is reported rather than assumed.
          brandStatCount: brandStats.length,
          brandStats: Array.from(brandStats).map(textOf),
          heading: typographyOf(heading),
          sub: typographyOf(heading ? heading.nextElementSibling : null),
          controls: Array.from(loginScreenElement.querySelectorAll("input, select, textarea")).map(
            (control) => {
              const cs = getComputedStyle(control);
              return {
                id: control.id,
                type: control.getAttribute("type"),
                ...rect(control),
                borderRadius: cs.borderRadius,
                borderColor: cs.borderTopColor,
                backgroundColor: cs.backgroundColor,
                fontSize: cs.fontSize,
                paddingLeft: cs.paddingLeft,
                ariaDescribedBy: control.getAttribute("aria-describedby"),
                ariaInvalid: control.getAttribute("aria-invalid"),
              };
            },
          ),
          submit: submit
            ? {
                text: textOf(submit),
                ...rect(submit),
                borderRadius: submitStyle.borderRadius,
                backgroundColor: submitStyle.backgroundColor,
                color: submitStyle.color,
                borderColor: submitStyle.borderTopColor,
                fontSize: submitStyle.fontSize,
                fontWeight: submitStyle.fontWeight,
                letterSpacing: submitStyle.letterSpacing,
              }
            : null,
          errorCount: errors.length,
          errors,
          // The design's login form is a bare 480px .form-box (line 51) and paints no
          // .card at all, so there is no card padding to report on this screen.
          cardPadding: null,
        };
      })()
    : null;

  // Additive: the four scoring screens' own header treatment. New key only - every key above
  // keeps its name, order and shape, no existing strategy is reordered or redefined, and the
  // exit codes are untouched. The key is null off the four scoring routes, so every other
  // capture is unchanged.
  //
  // Those four screens were the last consumers of the legacy SectionShell header, which is
  // being migrated onto the shared PageHeader primitive. The key is gated on the route path
  // (not on a class or a data attribute) so the SAME key reports the before and the after of
  // the migration instead of appearing only once the code has changed: the first main header
  // is the screen's own header on both implementations, and its parent is the wrapper element
  // the screen chose (the legacy section.space-y-6 before, the replacement box after).
  // Reading the resolved wrapper/header classes, the heading's level and computed size and
  // tracking, the eyebrow's computed family and size and the actions container makes the
  // header treatment machine-readable at the pixel level, which a static-markup test cannot do.
  const scoringPathname = location.pathname;
  const isScoringHeaderRoute =
    scoringPathname === "/admin/matches/setup" ||
    /\\/(?:scoring|point-entry|summary)$/.test(scoringPathname);
  const scoringHeaderElement = isScoringHeaderRoute
    ? document.querySelector("main header")
    : null;
  const scoringHeader = scoringHeaderElement
    ? (() => {
        const textOf = (el) =>
          el ? (el.innerText || el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 80) : null;
        const describe = (el, keys) => {
          if (!el) return null;
          const cs = getComputedStyle(el);
          return {
            tag: el.tagName.toLowerCase(),
            text: textOf(el),
            ...Object.fromEntries(keys.map((key) => [key, cs[key]])),
          };
        };
        const wrapper = scoringHeaderElement.parentElement;
        const column = scoringHeaderElement.firstElementChild;
        const children = column ? Array.from(column.children) : [];
        const paragraphs = children.filter((el) => el.tagName === "P");
        const heading = column ? column.querySelector("h1, h2") : null;
        const eyebrow = paragraphs.length > 1 ? paragraphs[0] : null;
        const description = paragraphs.length > 0 ? paragraphs[paragraphs.length - 1] : null;
        const actions = scoringHeaderElement.children[1] ?? null;
        return {
          route: scoringPathname,
          wrapper: wrapper
            ? { tag: wrapper.tagName.toLowerCase(), className: wrapper.className }
            : null,
          header: {
            tag: scoringHeaderElement.tagName.toLowerCase(),
            className: scoringHeaderElement.className,
          },
          heading: describe(heading, [
            "fontSize",
            "fontWeight",
            "lineHeight",
            "letterSpacing",
            "textTransform",
            "color",
          ]),
          eyebrow: describe(eyebrow, [
            "fontFamily",
            "fontSize",
            "fontWeight",
            "letterSpacing",
            "textTransform",
            "color",
          ]),
          description: describe(description, ["fontSize", "maxWidth"]),
          actions: actions
            ? { tag: actions.tagName.toLowerCase(), className: actions.className, text: textOf(actions) }
            : null,
          // The heading is the screens' h1 after the migration and was an h2 before, so the
          // count is reported instead of assumed; mainHeadingCount distinguishes "the screen
          // owns exactly one h1" from "the shell chrome's h1 leaked in".
          mainHeadingCount: document.querySelectorAll("main h1").length,
          tabIndex: heading ? heading.getAttribute("tabindex") : null,
        };
      })()
    : null;

  // Additive: the accessibility-semantics census. New keys only - every key above keeps its
  // name, order and shape, no existing strategy is reordered or redefined, and the exit
  // codes are untouched. Two defects live in the accessible state of a page rather than in
  // its pixels, so the DOM's own semantics are read instead of a class name:
  //
  //   currentPage  - every element carrying aria-current, with the value it carries, plus
  //                  the count of aria-current="page". The value "page" means "this link
  //                  points at the page you are on", so exactly one element per page may
  //                  carry it; a section link that merely contains the current location
  //                  must not.
  //   liveRegions  - every element that is a live region, either through role="status" or
  //                  through an explicit aria-live, with its role, politeness, accessible
  //                  label, text and whether it sits inside navigation. It also snapshots
  //                  each region's text twice, 2.6s apart, so regions whose content is bound
  //                  to changing state can be told apart from those painted with a fixed
  //                  literal.
  const censusTextOf = (el) =>
    el ? (el.textContent || "").trim().replace(/\\s+/g, " ").slice(0, 80) : null;
  const navLabelOf = (el) => {
    const nav = el.closest("nav");
    if (!nav) return null;
    return nav.getAttribute("aria-label") || "(nav sin etiqueta)";
  };

  const currentPage = Array.from(document.querySelectorAll("[aria-current]")).map((el) => ({
    tag: el.tagName.toLowerCase(),
    value: el.getAttribute("aria-current"),
    label: censusTextOf(el),
    href: el.getAttribute("href"),
    nav: navLabelOf(el),
  }));
  const currentPageCensus = {
    pageCount: currentPage.filter((entry) => entry.value === "page").length,
    entries: currentPage,
  };

  const liveRegionElements = Array.from(
    document.querySelectorAll('[role="status"], [aria-live]'),
  );
  const liveRegionTextBefore = liveRegionElements.map(censusTextOf);
  // The second sample only exists to tell a region whose text is bound to changing state
  // from one painted with a fixed literal, and the screen where that matters is the one
  // carrying more than one region - so only that screen pays the extra window. The fixture
  // set this app renders carries no clock, so no region in it changes on its own; the flag
  // therefore reads "the text did not change inside the window", not "the content is static".
  if (liveRegionElements.length > 1) {
    await new Promise((resolve) => setTimeout(resolve, 2600));
  }
  const liveRegionTextAfter = liveRegionElements.map(censusTextOf);
  const liveRegionCensus = {
    count: liveRegionElements.length,
    statusCount: liveRegionElements.filter((el) => el.getAttribute("role") === "status").length,
    entries: liveRegionElements.map((el, index) => ({
      tag: el.tagName.toLowerCase(),
      testId: el.getAttribute("data-testid"),
      role: el.getAttribute("role"),
      ariaLive: el.getAttribute("aria-live"),
      ariaAtomic: el.getAttribute("aria-atomic"),
      label: el.getAttribute("aria-label"),
      // The visible text the region shows (sr-only text included), and the same text after
      // a 2.6s window (sampled only when the route carries more than one region): a region
      // whose text differs between the two was rewritten during the capture.
      text: liveRegionTextBefore[index],
      textAfter: liveRegionTextAfter[index],
      changesOverTime: liveRegionTextBefore[index] !== liveRegionTextAfter[index],
      nav: navLabelOf(el),
      inSidebar: Boolean(el.closest("aside")),
    })),
  };

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
      // Additive keys: new names only, every key above is unchanged. navDestinations
      // reports which public sidebar destinations rendered, tableHeaders the column-header
      // semantics of every table, teamTabs the team detail's tab set and active treatment,
      // and kpiGrid the KPI grid's resolved columns and value typography.
      navDestinations,
      liveScreen,
      tableHeaders,
      teamTabs,
      kpiGrid,
      // Additive keys: new names only, every key above is unchanged. formControl reports the
      // rendered box, focus ring and label wiring of the first visible form control, modals
      // the design's dialog contract and its focus trap, filterPanels the collapsible filter
      // panels, and listStates the result count, the empty state and its restoration.
      formControl,
      modals,
      filterPanels,
      listStates,
      // Additive keys: new names only, every key above is unchanged. adminTournamentCards reports
      // the admin list's card treatment and its link destination, adminTournamentRegions which of
      // the tournament frame's regions rendered on the route, infoRows the Informacion and
      // Formato rows with their labels and values, and adminTournamentTabs the tab set with its
      // current entry and resolved treatment.
      adminTournamentCards,
      adminTournamentRegions,
      infoRows,
      adminTournamentTabs,
      // Additive keys: new names only, every key above is unchanged. adminTeamSquad reports the
      // inline roster builder's chips and their named remove affordances, adminTeamRegions which
      // of the admin team detail's regions rendered on the route, and adminTeamTabs the design's
      // tab set with its current entry and resolved treatment.
      adminTeamSquad,
      adminTeamRegions,
      adminTeamTabs,
      // Additive keys: new names only, every key above is unchanged. planilleroAssigned reports the
      // design's assigned-matches list (or its .card.empty-state branch) and planilleroSetup the
      // setup view's grid, its two team blocks, the contra separator, the .form-actions rule and
      // the "Iniciar partido" control together with the screen's form-control count, which is zero
      // because the design models no control here.
      planilleroAssigned,
      planilleroSetup,
      // Additive key: new name only, every key above is unchanged. loginScreen reports the
      // login route's own columns, branding panel, typography, controls and submit, and is
      // null on every other route.
      loginScreen,
      // Additive key: new name only, every key above is unchanged. scoringHeader reports the
      // four scoring screens' wrapper, header row, heading level and computed typography,
      // eyebrow computed typography, description measure, actions container, the main h1 count
      // and the heading's tabindex, and is null on every other route.
      scoringHeader,
      // Additive keys: new names only, every key above is unchanged. currentPageCensus counts
      // the elements claiming aria-current="page" and lists every aria-current value with its
      // label, href and enclosing nav; liveRegionCensus lists every live region with its role,
      // politeness and text, and whether that text changed across a 2.6s window.
      currentPageCensus,
      liveRegionCensus,
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
