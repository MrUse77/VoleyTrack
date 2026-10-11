# tools/screenshot.mjs

Deterministic route screenshots for VoleyTrack, with a machine-readable design-probe report.
Visual parity with the pack in `design/html/` cannot be proven by tests, lint or build, so this
is the tool that produces the actual pixels.

## Quick start

```bash
cd frontend
pnpm run dev                     # terminal 1 — the app must be serving
pnpm screenshot --route /login --out screenshots/login.png   # terminal 2
```

`pnpm screenshot` is an alias for `node tools/screenshot.mjs`.

## What it does

1. Checks the target URL is reachable (clear error + exit 68 if not — never a blank image).
2. Launches a hidden Electron `BrowserWindow` (1440x900 content area by default), using the
   Electron already present in the sibling `open-design` checkout — **no new dependency**.
3. Waits explicitly and generously: `readyState === "complete"` and `#root` has children
   (React mounted), then `document.fonts.status === "loaded"`, then a settle delay
   (default 1200 ms), then freezes CSS animations/transitions/caret blink.
4. Runs a fixed DOM probe list (see below), captures with `webContents.capturePage()`,
   writes the PNG, writes a `.json` next to it and prints the same JSON to stdout.
5. Exits non-zero on any real capture failure: unreachable URL, load failure, blank page,
   Vite error overlay, flat single-colour image, empty PNG. A probe value that simply does
   not match the design is **reported, never fatal**.

## Options

| Flag | Default | Meaning |
|------|---------|---------|
| `--route <path>` | `/` | Route to capture, e.g. `/login` |
| `--url <url>` | — | Full URL; overrides `--route`/`--base` |
| `--base <url>` | `http://localhost:5173` | Server origin (`$SCREENSHOT_BASE_URL` also works) |
| `--out <file>` | `screenshots/<slug>.png` | PNG path, relative to `frontend/` |
| `--json-out <file>` | `<out>.json` | JSON path |
| `--width` / `--height` | `1440` / `900` | Viewport (1440 px is the design canvas width) |
| `--settle <ms>` | `1200` | Extra delay after fonts are ready |
| `--timeout <ms>` | `30000` | Timeout per wait stage |
| `--expect <text>` | `VoleyTrack` | Required body text, repeatable |
| `--no-freeze` | — | Keep animations/transitions/caret blinking |
| `--no-json` / `--quiet` | — | `--no-json`: no report at all. `--quiet`: report not printed to stdout (progress stays on stderr, so stdout is a clean JSON document when you do want it). |

Environment: `ELECTRON_BIN` overrides the Electron binary;
`VT_SCREENSHOT_SOFTWARE_RENDER=1` disables hardware acceleration (only if the GPU is unusable —
with software rendering a *hidden* window may not produce frames, and the tool then falls back
to `showInactive()`).
## Reading the report

`probes` is the stable comparison surface; `capturedAt`, `timing` and `output.sha256` are volatile.

- `probes.fonts` — `document.fonts.status`, per-family availability and the computed
  `font-family` of `body`.
- `probes.topbar` / `probes.sidebar` — resolved `width`/`height` of `header` / `aside` when the
  route has them, against the design values 72 px and 248 px.
- `probes.accent` — computed `color` / `background-color` of the first accent-filled element
  (`aside [aria-current]`, else `button`), reported as resolved `rgb(...)`; the design accent is
  `rgb(255, 140, 66)`.
- `probes.content` — `innerText.length`, a text preview, `#root` child count, whether a Vite
  error overlay is present, and whether the expected strings were found.
- `pixels` — sampled colour diversity of the captured bitmap; `isFlatSingleColor: true` means
  nothing rendered and the run fails.

## Reproducibility notes

- Two runs of the same route produce byte-identical PNGs (verified for `/` and `/login`).
- The tool uses its own Electron profile at `$TMPDIR/voleytrack-screenshot-profile` (reused
  between runs, and the HTTP cache is cleared each time so a capture never shows stale JS).
  Sharing the default `~/.config/Electron` with the other Electron apps on this machine makes
  the GPU/zygote processes fail with `FATAL: GPU process isn't usable. Goodbye.`
- Captures go to `screenshots/`, which is git-ignored.
- Electron's ESM main entry emits `ready` only after the entry module finishes evaluating, so a
  top-level `await app.whenReady()` deadlocks. This script never awaits it at evaluation time.
