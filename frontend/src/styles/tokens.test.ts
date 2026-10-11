import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const srcRootPath = fileURLToPath(new URL("..", import.meta.url));

function collectSourceFiles(directory: string, collected: string[] = []): string[] {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = `${directory}/${entry.name}`;

    if (entry.isDirectory()) {
      collectSourceFiles(entryPath, collected);
      continue;
    }

    collected.push(entryPath);
  }

  return collected;
}

function countOccurrences(filePaths: string[], source: string): number {
  let total = 0;

  for (const filePath of filePaths) {
    const matches = readFileSync(filePath, "utf8").match(new RegExp(source, "g"));
    total += matches?.length ?? 0;
  }

  return total;
}

function stripCssComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, " ");
}

/**
 * Cascade-position scanner. A plain regex cannot answer "is this rule inside
 * `@layer`?", because `@layer base { ... }` legitimately wraps `a` and `button`
 * rules. This walks the stylesheet character by character and records, for every
 * style rule, whether any enclosing block in its source position is an `@layer`
 * block. `@media` and other at-rules deliberately do NOT count: they are not
 * layers, so a rule nested in one is still unlayered and still beats every layer.
 */
function collectRuleSelectors(source: string): { selector: string; insideLayer: boolean }[] {
  const rules: { selector: string; insideLayer: boolean }[] = [];
  const openBlocks: Array<"layer" | "other"> = [];
  let preludeStart = 0;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];

    if (character === "{") {
      const prelude = source.slice(preludeStart, index).trim();
      const insideLayer = openBlocks.includes("layer");

      if (prelude.startsWith("@layer")) {
        openBlocks.push("layer");
      } else {
        openBlocks.push("other");
        // At-rule preludes (`@media ...`) are not style rules, so they carry no selector.
        if (!prelude.startsWith("@")) rules.push({ selector: prelude, insideLayer });
      }

      preludeStart = index + 1;
      continue;
    }

    if (character === "}") {
      openBlocks.pop();
      preludeStart = index + 1;
      continue;
    }

    // Also skips `@import ...;`, `@source ...;` and the statement form `@layer a, b;`.
    if (character === ";") preludeStart = index + 1;
  }

  return rules;
}

const tokensPath = fileURLToPath(new URL("./tokens.css", import.meta.url));
const indexPath = fileURLToPath(new URL("../index.css", import.meta.url));
const publicShellPath = fileURLToPath(new URL("../layouts/PublicShell.tsx", import.meta.url));
const adminShellPath = fileURLToPath(new URL("../layouts/AdminShell.tsx", import.meta.url));
const scoringConsolePath = fileURLToPath(new URL("../features/scoring/ScoringConsolePage.tsx", import.meta.url));
const placeholderPagePath = fileURLToPath(new URL("../pages/PlaceholderPage.tsx", import.meta.url));
const adminPagePath = fileURLToPath(new URL("../pages/AdminPage.tsx", import.meta.url));
const planilleroPagePath = fileURLToPath(new URL("../pages/PlanilleroPage.tsx", import.meta.url));
const createTeamPagePath = fileURLToPath(new URL("../features/admin/CreateTeamPage.tsx", import.meta.url));
const playerDetailPath = fileURLToPath(new URL("../features/public/PlayerDetailPage.tsx", import.meta.url));
const playerSelectionModalPath = fileURLToPath(new URL("../features/scoring/PlayerSelectionModal.tsx", import.meta.url));
const matchSetupPath = fileURLToPath(new URL("../features/scoring/MatchSetupPage.tsx", import.meta.url));
const pointEntryPath = fileURLToPath(new URL("../features/scoring/PointEntryPage.tsx", import.meta.url));
const postMatchSummaryPath = fileURLToPath(new URL("../features/scoring/PostMatchSummaryPage.tsx", import.meta.url));
const sidebarPath = fileURLToPath(new URL("../components/navigation/Sidebar.tsx", import.meta.url));
const scoringFixturePath = fileURLToPath(new URL("../fixtures/scoring.ts", import.meta.url));

describe("design tokens", () => {
  it("defines the canonical palette and desktop canvas policy", () => {
    expect(existsSync(tokensPath)).toBe(true);

    const tokens = readFileSync(tokensPath, "utf8");
    const index = readFileSync(indexPath, "utf8");

    for (const value of [
      "#0b1220",
      "#111a2b",
      "#0f1726",
      "#162032",
      "#f8fafc",
      "#94a3b8",
      "#64748b",
      "#ff8c42",
      "#3b82f6",
      "#22c55e",
      "#ef4444",
      "#243249",
    ]) {
      expect(tokens).toContain(value);
    }

    expect(tokens).not.toContain("#4caf50");
    expect(tokens).not.toContain("#f44336");

		expect(index).toContain('@import "./styles/tokens.css";');
		expect(index).not.toContain("min-width: 1440px");

		const publicShell = readFileSync(publicShellPath, "utf8");
		const adminShell = readFileSync(adminShellPath, "utf8");
		expect(publicShell).not.toContain("min-w-[1440px]");
		expect(adminShell).not.toContain("min-w-[1440px]");
		expect(publicShell).toContain("min-w-0");
		expect(adminShell).toContain("min-w-0");
  });

  it("applies canonical surface roles and the Inter-first font token globally", () => {
    const tokens = readFileSync(tokensPath, "utf8");
    const index = readFileSync(indexPath, "utf8");

    expect(tokens).toContain("--color-vt-background: #0b1220");
    expect(tokens).toContain("--color-vt-surface: #111a2b");
    expect(tokens).toContain("--color-vt-panel: #0f1726");
    expect(tokens).toContain("--color-vt-raised: #1e293b");
    expect(tokens).toContain('--font-sans: "Inter", system-ui, sans-serif');
    expect(index).toMatch(/:root\s*{[^}]*font-family: var\(--font-sans\);/s);
    expect(index).toMatch(/body\s*{[^}]*font-family: var\(--font-sans\);/s);
    expect(index).not.toContain('font-family: "Roboto"');
  });

  it("adds the surface, accent-soft, radius, mono font and shadow tokens of the vendored design", () => {
    const tokens = readFileSync(tokensPath, "utf8");

    expect(tokens).toContain("--color-vt-surface-2: #162032");
    expect(tokens).toContain("--color-vt-muted-2: #64748b");
    expect(tokens).toContain("--color-vt-blue: #3b82f6");
    expect(tokens).toContain(
      "--color-vt-accent-soft: color-mix(in oklch, var(--color-vt-accent) 14%, transparent)",
    );
    expect(tokens).toContain("--radius-vt: 16px");
    expect(tokens).toContain("--radius-vt-sm: 10px");
    expect(tokens).toContain('--font-mono: "JetBrains Mono", ui-monospace, monospace');
    expect(tokens).toContain("--shadow-vt: 0 8px 24px rgba(0,0,0,.35)");
    expect(tokens).toContain("--color-vt-raised-border: #334155");
  });

  it("uses the canonical canvas without a non-semantic global gradient", () => {
    const index = readFileSync(indexPath, "utf8");

    expect(index).toContain("background: var(--color-vt-background)");
    expect(index).not.toContain("radial-gradient");
    expect(index).not.toContain("#09101a");
  });

  it("normalizes generic page surfaces to canonical tokens without white/black leaks", () => {
    // `pages/LoginPage.tsx` left this list with T10: it was an orphan (the live `/login`
    // route renders `features/auth/LoginPage.tsx`), so the file is gone.
    for (const filePath of [scoringConsolePath, placeholderPagePath, adminPagePath, planilleroPagePath]) {
      const source = readFileSync(filePath, "utf8");

      expect(source).toMatch(/bg-vt-(panel|surface|raised)/);
      expect(source).toContain("border-vt-border");
      expect(source).not.toContain("border-white/");
      expect(source).not.toContain("bg-white/");
      expect(source).not.toContain("bg-black/");
    }

    expect(readFileSync(scoringConsolePath, "utf8")).toMatch(/bg-vt-(panel|surface)/);
    expect(readFileSync(placeholderPagePath, "utf8")).toContain("bg-vt-panel");
    expect(readFileSync(adminPagePath, "utf8")).toContain("bg-vt-panel");
    expect(readFileSync(planilleroPagePath, "utf8")).toContain("bg-vt-panel");
  });

  it("normalizes CreateTeamPage slate tokens to vt", () => {
    const source = readFileSync(createTeamPagePath, "utf8");

    expect(source).toContain("border-vt-border");
    expect(source).toContain("bg-vt-panel");
    expect(source).toContain("bg-vt-raised");
    expect(source).toContain("text-vt-muted");
    expect(source).toContain("text-vt-background");
    expect(source).not.toContain("slate-");
    expect(source).not.toContain("bg-slate-");
    expect(source).not.toContain("border-slate-");
    expect(source).not.toContain("text-slate-");
  });

  it("normalizes remaining slate tokens in PlayerDetail and scoring pages", () => {
    for (const filePath of [playerDetailPath, playerSelectionModalPath, matchSetupPath, scoringConsolePath, pointEntryPath]) {
      const source = readFileSync(filePath, "utf8");
      expect(source).not.toContain("bg-slate-");
      expect(source).not.toContain("text-slate-");
      expect(source).not.toContain("from-slate-");
      expect(source).not.toContain("to-slate-");
      expect(source).not.toContain("border-slate-");
    }

    const playerDetail = readFileSync(playerDetailPath, "utf8");
    expect(playerDetail).toContain("bg-vt-panel");
    expect(playerDetail).toContain("text-vt-muted");
    expect(playerDetail).not.toContain("bg-slate-900");
    expect(playerDetail).not.toContain("text-slate-200");

    for (const filePath of [playerSelectionModalPath, matchSetupPath, scoringConsolePath, pointEntryPath]) {
      const source = readFileSync(filePath, "utf8");
      expect(source).toContain("text-vt-background");
      expect(source).not.toContain("text-slate-950");
    }
  });

  it("normalizes PostMatchSummaryPage scoring tokens without white/black/slate leaks", () => {
    const source = readFileSync(postMatchSummaryPath, "utf8");
    expect(source).toContain("border-vt-border");
    expect(source).toMatch(/bg-vt-(panel|surface|raised)/);
    expect(source).toContain("bg-vt-panel");
    expect(source).toContain("text-vt-muted");
    expect(source).toContain("text-vt-background");
    expect(source).not.toContain("bg-white");
    expect(source).not.toContain("text-white");
    expect(source).not.toContain("bg-black");
    expect(source).not.toContain("border-white/");
    expect(source).not.toContain("bg-slate-");
    expect(source).not.toContain("text-slate-");
    expect(source).not.toContain("border-slate-");
    expect(source).not.toContain("slate-");
    expect(source).not.toContain("vt-canvas");
  });

  it("keeps the whole source tree free of the undefined vt-canvas colour utility", () => {
    // Class-like occurrence, not the bare substring: the token is only ever a hazard as a
    // Tailwind colour utility, i.e. with a utility prefix (a letter followed by word/hyphen
    // characters) immediately before `vt-canvas`. That shape is what the bare quoted literal
    // does NOT satisfy, which is why this guard no longer has to skip itself to avoid
    // matching its own assertion text, and therefore covers the whole tree.
    const classLikeVtCanvas = /[A-Za-z][\w-]*-vt-canvas\b/;
    const bareToken = "vt-canvas";

    // A pattern that cannot discriminate is a broken guard, not a strict one: the class-like
    // shape must match a real utility and must NOT match the bare quoted literal. The samples
    // are assembled rather than written out so this file does not contain the very shape it
    // bans.
    expect(classLikeVtCanvas.test(`<span className="text-${bareToken}" />`)).toBe(true);
    expect(classLikeVtCanvas.test(`hover:bg-${bareToken}/50`)).toBe(true);
    expect(classLikeVtCanvas.test(`"${bareToken}"`)).toBe(false);

    const sourceFiles = collectSourceFiles(srcRootPath);

    expect(sourceFiles.length).toBeGreaterThan(0);

    const offenders: string[] = [];

    for (const filePath of sourceFiles) {
      readFileSync(filePath, "utf8")
        .split("\n")
        .forEach((line, index) => {
          if (classLikeVtCanvas.test(line)) {
            offenders.push(`${filePath.slice(srcRootPath.length)}:${index + 1} ${line.trim()}`);
          }
        });
    }

    expect(offenders).toEqual([]);
  });

  it("keeps the auth, layout and dashboard surfaces free of raw colour literals", () => {
    const authDir = fileURLToPath(new URL("../features/auth", import.meta.url));
    const layoutsDir = fileURLToPath(new URL("../layouts", import.meta.url));
    const dashboardPagePath = fileURLToPath(new URL("../features/public/DashboardPage.tsx", import.meta.url));

    const tsxIn = (directory: string): string[] =>
      readdirSync(directory)
        .filter((name) => name.endsWith(".tsx"))
        .map((name) => `${directory}/${name}`);

    const guarded = [...tsxIn(authDir), ...tsxIn(layoutsDir), dashboardPagePath];

    // A guard that matches zero files is a broken guard, not a passing one.
    expect(guarded.length).toBeGreaterThan(0);

    // Raw hex (3 to 8 digits), rgb()/rgba(), and the disallowed Tailwind utility families.
    const forbidden = /#[0-9a-fA-F]{3,8}\b|rgba?\(|\b(?:text|bg|border)-white\b|\bbg-black\b|\bslate-/;

    const offenders: string[] = [];

    for (const filePath of guarded) {
      readFileSync(filePath, "utf8")
        .split("\n")
        .forEach((line, index) => {
          if (forbidden.test(line)) {
            offenders.push(`${filePath.slice(srcRootPath.length)}:${index + 1} ${line.trim()}`);
          }
        });
    }

    expect(offenders).toEqual([]);
  });

  it("keeps scoring fixtures as pure immutable data without color leaks", () => {
    const source = readFileSync(scoringFixturePath, "utf8");
    expect(source).not.toContain("bg-white");
    expect(source).not.toContain("bg-black");
    expect(source).not.toContain("bg-slate-");
    expect(source).not.toContain("text-slate-");
    expect(source).not.toContain("border-slate-");
    expect(source).not.toContain("slate-");
    expect(source).not.toContain("white");
    expect(source).toContain("Object.freeze");
  });

  it("pins the sidebar surface and divider to the design on both shells", () => {
    const source = readFileSync(sidebarPath, "utf8");

    // Design source: frontend/design/html/voleytrack.css:50 and
    // frontend/design/html/voleytrack-admin.css:55 both declare
    //   .sidebar{background:var(--surface);border-right:1px solid var(--border-2);...}
    // The design maps --surface to #111a2b (--color-vt-surface) and --border-2 to
    // #1e293b (--color-vt-border-2). The sidebar's own class list must carry exactly
    // those two, pinned as one contiguous fragment so a reorder or a partial swap
    // cannot slip through.
    expect(source).toContain("border-r border-vt-border-2 bg-vt-surface");
    expect(source).toContain("voleytrack.css:50");
    expect(source).toContain("voleytrack-admin.css:55");

    // The two drifts this guards: the canvas fill (--bg, which the admin shell used to
    // paint the sidebar with) and the heavier --border divider. `text-vt-background` is
    // the active nav item's ink, not the sidebar surface, so only `bg-` is banned.
    expect(source).not.toContain("bg-vt-background");
    // The divergence root cause: the sidebar surface must not branch per shell.
    expect(source).not.toContain('variant === "admin"');
  });

  // Design-layer debt ratchet. `vt-panel`, `vt-raised` and `vt-raised-border` are
  // app-only tokens with no counterpart in the vendored design (frontend/design/html),
  // which only defines --bg, --surface, --surface-2 and the border tones
  // #243249 (--border) / #1e293b (--border-2). The migration happens one screen at a
  // time, so this guard only forbids the debt from growing: counts must stay at or
  // below their measured ceiling and may legitimately drop as screens are aligned
  // (lower the ceiling in the same change whenever a count drops).
  // Cascade-position guard. Tailwind orders its layers as theme, base, components,
  // utilities, and an UNLAYERED declaration beats every layer regardless of source
  // order and specificity. `a, button { font: inherit }` used to sit at the top level
  // of src/index.css, which forced every link and button in the app to 16px/400: the
  // primitive Button computes 13px/700 from its own utilities and a sidebar <a>
  // 14px/600, and the same position also defeated `cursor-not-allowed` and the
  // `focus-visible:outline-*` utilities. Application rules therefore belong in
  // `@layer base`, where Tailwind's later `utilities` layer beats them.
  it("keeps every a and button selector inside a cascade layer", () => {
    const index = stripCssComments(readFileSync(indexPath, "utf8"));
    const rules = collectRuleSelectors(index);

    // A scanner that parses zero rules is a broken guard, not a passing one.
    expect(rules.length).toBeGreaterThan(0);
    expect(rules.some((rule) => rule.insideLayer)).toBe(true);

    const isElementSelector = (element: string, selector: string) =>
      new RegExp(`(^|[\\s>+~,(])${element}(?![\\w-])`).test(selector);

    const unlayered = rules.filter(
      (rule) =>
        !rule.insideLayer &&
        rule.selector
          .split(",")
          .some(
            (selector) =>
              isElementSelector("a", selector) || isElementSelector("button", selector),
          ),
    );

    expect(
      unlayered.map((rule) => rule.selector),
      "An a/button selector outside `@layer base` is unlayered, so it beats Tailwind's " +
        "@layer utilities regardless of source order and specificity, and silently defeats " +
        "font-*, cursor-* and outline-* utilities on EVERY link and button in the app. " +
        "Move it inside `@layer base { ... }`.",
    ).toEqual([]);
  });

  it("ratchets app-only surface and border token usage down without allowing new usages", () => {
    const guardPath = resolve(fileURLToPath(import.meta.url));
    // The declaration file necessarily names every token once (and documents them),
    // and this guard file itself holds the patterns. Neither is a consumer, so both
    // are excluded; everything else under src/ is ratcheted.
    const nonConsumers = new Set([guardPath, resolve(tokensPath)]);
    const sourceFiles = collectSourceFiles(srcRootPath).filter((filePath) => !nonConsumers.has(resolve(filePath)));

    // A guard that matches zero files is a broken guard, not a passing one.
    expect(sourceFiles.length).toBeGreaterThan(0);

    // Patterns are disjoint, so the counts cannot double-count each other:
    // - /vt-raised(?![\-\w])/ ends in a negative lookahead, so the `vt-raised` prefix of
    //   `vt-raised-border` is NOT counted as a `vt-raised` usage (it is followed by `-`).
    // - /vt-raised-border/ can only match its own literal, and /vt-panel(?![\-\w])/ cannot
    //   match any part of the two raised patterns.
    // Occurrences are counted, not lines, so several usages on one className all count.
    // Ceilings are measured, not invented. The layer-mapping change measured 97 vt-panel
    // usages in 51 files, 48 vt-raised usages in 28 files and 9 vt-raised-border usages in
    // 7 files. Retiring the duplicated form-field wrapper, moving the Badge base onto the
    // design's --bg fill and dropping the retired-wrapper assertion from core.test.tsx
    // took vt-panel down to 94 usages in 48 files, and aligning the shell with the design
    // (T09) took vt-panel to 93 in 48 files and vt-raised to 46 in 26 files: the sidebar
    // nav's hover moved to the design's --surface-2, its admin active fill moved to
    // --accent, and the admin-active assertion in layouts/shells.test.tsx moved off
    // bg-vt-raised. T10 removed the legacy shell, the orphaned pages and the dead-route
    // PlaceholderPage imports, which took vt-panel to 85 usages in 43 files. T10b then deleted
    // the dead component cluster (`DashboardHero`/`DashboardLive`/`DashboardRail`,
    // `MatchesBrowser`, the two dead barrels and `ui/Surface`), which took vt-panel to 73
    // usages in 39 files, so the ceiling moves with it (measured with this guard's own patterns
    // and exclusions). vt-raised (46/26) and vt-raised-border (9/7) were untouched by that
    // deletion, so their ceilings stay at their measured values. Lowering every ceiling in the
    // same change as the drop is what keeps a slack ceiling from re-spending the freed budget.
    const ratchets = [
      { token: "vt-panel", pattern: "vt-panel(?![\\-\\w])", ceiling: 73, baselineFiles: 39 },
      { token: "vt-raised", pattern: "vt-raised(?![\\-\\w])", ceiling: 46, baselineFiles: 26 },
      { token: "vt-raised-border", pattern: "vt-raised-border", ceiling: 9, baselineFiles: 7 },
    ];

    for (const { token, pattern, ceiling, baselineFiles } of ratchets) {
      const occurrences = countOccurrences(sourceFiles, pattern);

      expect(
        occurrences,
        `${token} is an app-only layer with no design counterpart. Measured baseline: ${ceiling} occurrences across ${baselineFiles} files. ` +
          `Fewer is progress (low this ceiling); more means new ${token} usage was introduced.`,
      ).toBeLessThanOrEqual(ceiling);
    }
  });
});
