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
 * Production `.tsx` files only, collected with the same convention `core.test.tsx` uses: the
 * `generated` / `__generated__` directories are skipped and every `.test.tsx`, `.spec.tsx` and
 * `.gen.tsx` file is excluded. A test that asserts on a token literal is not a shipped colour,
 * so scanning tests turns the guard's own pins into false positives.
 */
function productionTsxFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = `${directory}/${entry.name}`;

      if (entry.isDirectory()) {
        return ["generated", "__generated__"].includes(entry.name) ? [] : productionTsxFiles(entryPath);
      }

      if (!entry.name.endsWith(".tsx") || /\.(?:test|spec|gen)\.tsx$/.test(entry.name)) return [];
      return [entryPath];
    })
    .sort();
}

/**
 * Comment-aware source stripper. A comment that cites a forbidden literal is documentation,
 * not a defect, so its text must not reach the colour pattern.
 *
 * This walks the source instead of running a regex, because a naive regex would strip a `//`
 * that lives inside a string or a URL (`"https://..."`, `to="/foo//bar"`). String bodies are
 * copied verbatim, so their contents are never treated as delimiters. Block-comment newlines
 * are re-emitted, so a later line's reported number still points at the real source line.
 * Regex literals are not modelled (no production file here carries a `//` inside one).
 */
function stripJsComments(source: string): string {
  const quoteCharacters = ['"', "'", "`"];
  let stripped = "";
  let index = 0;

  while (index < source.length) {
    const character = source[index];

    if (quoteCharacters.includes(character)) {
      stripped += character;
      index += 1;

      while (index < source.length) {
        const stringCharacter = source[index];
        stripped += stringCharacter;

        if (stringCharacter === "\\" && index + 1 < source.length) {
          stripped += source[index + 1];
          index += 2;
          continue;
        }

        index += 1;
        if (stringCharacter === character) break;
      }

      continue;
    }

    if (character === "/" && source[index + 1] === "/") {
      while (index < source.length && source[index] !== "\n") index += 1;
      continue;
    }

    if (character === "/" && source[index + 1] === "*") {
      index += 2;

      while (index < source.length && !(source[index] === "*" && source[index + 1] === "/")) {
        if (source[index] === "\n") stripped += "\n";
        index += 1;
      }

      index += 2;
      continue;
    }

    stripped += character;
    index += 1;
  }

  return stripped;
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
    // `pages/PlaceholderPage.tsx` left it the same way: no route rendered it any more and
    // nothing imported it, so the dead file (and its own test) are gone.
    // The pattern now includes the design's `--bg` layer (`bg-vt-background`) as well: the
    // planillero's setup blocks are the design's `.setup-team{background:var(--bg)}`
    // (frontend/design/html/voleytrack-admin.css:214), which is a canonical token with no
    // app-only counterpart, so a screen that uses it is more aligned, not less.
    for (const filePath of [scoringConsolePath, adminPagePath, planilleroPagePath]) {
      const source = readFileSync(filePath, "utf8");

      expect(source).toMatch(/bg-vt-(panel|surface|raised|background)/);
      expect(source).toContain("border-vt-border");
      expect(source).not.toContain("border-white/");
      expect(source).not.toContain("bg-white/");
      expect(source).not.toContain("bg-black/");
    }

    expect(readFileSync(scoringConsolePath, "utf8")).toMatch(/bg-vt-(panel|surface)/);
    expect(readFileSync(adminPagePath, "utf8")).toContain("bg-vt-panel");

    // The planillero's alignment replaced the whole control-room screen, so the app-only
    // `bg-vt-panel` surfaces it was built from are gone. The assertion is inverted into an absence
    // pin: the design's own layers (`--bg` on the setup blocks, `--surface` through the Card
    // primitive) are what the source may carry now, and the retired token may not come back.
    const planilleroSource = readFileSync(planilleroPagePath, "utf8");
    expect(planilleroSource).toContain("bg-vt-background");
    expect(planilleroSource).not.toContain("bg-vt-panel");
    expect(planilleroSource).not.toContain("bg-vt-raised");
  });

  it("normalizes CreateTeamPage slate tokens to vt", () => {
    const source = readFileSync(createTeamPagePath, "utf8");

    expect(source).toContain("border-vt-border");
    expect(source).toContain("text-vt-muted");
    expect(source).toContain("text-vt-background");
    expect(source).not.toContain("slate-");
    expect(source).not.toContain("bg-slate-");
    expect(source).not.toContain("border-slate-");
    expect(source).not.toContain("text-slate-");

    // The alignment replaced the screen's app-only surfaces (`bg-vt-raised` box,
    // `bg-vt-panel` roster/feedback/assign panels) with the design's structural cards and its
    // own `--surface-2` / `--background` layers, so the guard now pins the design layers
    // instead of the retired ones. The shared `Field` control still paints `--bg`.
    expect(source).toContain("border-vt-border-2");
    expect(source).toContain("bg-vt-background");
    expect(source).not.toContain("bg-vt-panel");
    expect(source).not.toContain("bg-vt-raised");
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
    // The hero used the app-only panel layer, which the vendored design never defined. The
    // colour-alignment slice removed it and left the surface to the `Card` primitive's own default
    // (`variant="surface"`, frontend/design/html/voleytrack.css:75
    // `.card{background:var(--surface);...}`) instead of restating a background class at the call
    // site, which `core.test.tsx`'s typed-variant guard also vetoes. The ink is the pin here,
    // together with the absence of the retired layer: `text-vt-text` and `text-vt-background` are
    // the design's `--fg` and `--bg`.
    expect(playerDetail).not.toContain("bg-vt-panel");
    expect(playerDetail).not.toContain("bg-vt-raised");
    expect(playerDetail).not.toMatch(/<Card\b[^>]*bg-vt-/s);
    expect(playerDetail).toContain("text-vt-text");
    expect(playerDetail).toContain("text-vt-muted");
    expect(playerDetail).toContain("text-vt-background");
    expect(playerDetail).not.toContain("text-white");
    expect(playerDetail).not.toContain("bg-slate-900");
    expect(playerDetail).not.toContain("text-slate-200");
    // The screen's four remaining non-panel tones are the vendored design's own: `--blue` and
    // `--success` for the recent-match result rules, and (since the owner's decision) the
    // `--accent` that the design's `.stat-bar` declares for BOTH halves of every row
    // (voleytrack-admin.css:300-305). `bg-vt-blue` is gone from this screen on purpose: the
    // `block` bar tone it painted was one of the four per-stat colours the decision removed.
    expect(playerDetail).not.toContain("bg-vt-blue");
    expect(playerDetail).toContain("bg-vt-success");

    // The owner's decision, pinned as a behaviour instead of as prose: every stat row carries
    // the design accent on its fill AND on its value ink, and the per-stat tone map that used to
    // sit between them is gone (a map that returns one value for all five keys implies the tones
    // still mean something). The rendered values are measured by the harness probe
    // (tools/screenshot.mjs `probes.statBars`, all five rows `matchesDesign`).
    expect(playerDetail).toContain('className="block h-full rounded-full bg-vt-accent"');
    expect(playerDetail).toContain('text-vt-accent min-[1416px]:ml-1.5');
    expect(playerDetail).not.toContain("statToneClasses");

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

  // The guard now scans every production `.tsx` file under `src` with the same walker
  // `core.test.tsx` uses (`productionTsxFiles`), and strips comments before matching. Two
  // earlier exclusions were consequences of the guard's own blind spots, not of real colour
  // usage:
  //
  //   * `components/primitives` failed only because `core.test.tsx` asserts on the token
  //     literals themselves. A test file is not shipped UI, so the production walker removes
  //     those 19 hits.
  //   * `features/public`, `features/admin` and `components/navigation` failed only on comment
  //     text that cites a design hex/rgba. Stripping comments removes those 6 hits.
  //
  // Every group was measured with THIS pattern and this walker BEFORE it was admitted. Measured
  // production files / offenders under the improved guard:
  //
  //   group                    files  offenders  note
  //   features/auth                3          0
  //   features/scoring             5          0
  //   features/public             22          0  the 4 old hits (LiveMatchPresentation.tsx:73,302,303,
  //                                             TournamentBracket.tsx:85) were all comment text
  //   features/admin              25          0  the 1 old hit (AdminTeamShell.tsx:59) was a comment
  //   layouts                      2          0
  //   components/states            1          0
  //   components/navigation        2          0  the 1 old hit (Sidebar.tsx:81) was a comment
  //   components/primitives       19          0  the 19 old hits were core.test.tsx's literal pins
  //   pages                        2          0  AdminPage.tsx:47 was a real leak and was fixed here
  //   root (App/main/router)       3          0
  //   total                       84          0
  //
  // The stock-palette extension below closes the gap that let the `purple-500` / `pink-500`
  // utilities ship on two of the five player stat bars while this guard reported zero offenders.
  // The old pattern banned raw hex, `rgb(`, `white`, `black` and `slate-`, but Tailwind's own
  // default palette is neither a raw literal nor the `slate-` family, so ANY stock-palette colour
  // utility passed: the `blue-500` / `green-500` tints the breakdown had already moved off, the
  // `purple-500` / `pink-500` that were still live, and every combination with them nobody had
  // thought of. Two of those four were found by eye rather than by the guard, and two were live
  // in shipped code until this change. A Tailwind stock-palette colour is by definition
  // off-system in an app whose every colour is a `vt-` token.
  //
  // This prose deliberately names the shades WITHOUT a utility prefix. Tailwind v4 scans every
  // non-ignored file, this guard file included, for candidate class names, and it does not know
  // about comments: writing the prefixed form here emits a real rule into the shipped stylesheet
  // for a class nothing uses, i.e. the guard's own text keeping alive the exact utility it bans.
  // (The rest of this file already follows that rule for its samples, which are assembled from
  // the lists below rather than written out.)
  it("keeps every production TSX file free of raw colour literals and stock-palette colour utilities", () => {
    const guarded = productionTsxFiles(srcRootPath);

    // A guard that matches zero files is a broken guard, not a passing one.
    expect(guarded.length).toBeGreaterThan(0);
    // The groups this slice added must stay in scope, so a later edit cannot silently shrink
    // coverage back to the first slice's handful of directories.
    for (const group of ["features/scoring", "features/public", "features/admin", "components/primitives", "components/navigation", "pages"]) {
      expect(guarded.some((filePath) => filePath.startsWith(`${srcRootPath}/${group}/`))).toBe(true);
    }

    // Raw hex (3 to 8 digits), rgb()/rgba(), and the disallowed Tailwind utility families.
    const rawColour =
      /#[0-9a-fA-F]{3,8}\b|rgba?\(|\b(?:text|bg|border)-white\b|\bbg-black\b|\bslate-/;

    // Tailwind's stock palette, complete rather than hand-picked: the point is to catch the
    // hue nobody thought of, and a subset guard just moves the blind spot. `slate` is already
    // banned outright above and is kept here only so the enumeration stays the real palette.
    const stockPaletteNames = [
      "slate", "gray", "zinc", "neutral", "stone", "red", "orange", "amber", "yellow",
      "lime", "green", "emerald", "teal", "cyan", "sky", "blue", "indigo", "violet",
      "purple", "fuchsia", "pink", "rose",
    ];

    // The colour-bearing utility families this app actually uses, measured over the production
    // tree. `via` comes with `from`/`to` (a gradient stop is a colour position too); every other
    // family here appears in shipped code. Families that carry no colour (`shadow-vt-focus-ring`)
    // and non-colour utilities of the same families (`border-b`, `outline-offset-2`, `text-sm`,
    // `divide-y`, `ring-2`) cannot match, because a palette name AND a numeric shade must follow.
    const colourUtilityPrefixes = [
      "text", "bg", "border", "ring", "outline", "from", "via", "to", "divide", "accent",
      "shadow",
    ];

    // Tailwind's shade scale. Enumerated instead of `\d{2,3}` so a legitimate utility that
    // happens to end in a number cannot be mistaken for a palette shade.
    const stockShade = "(?:50|[1-9]00|[1-9]50)";

    // One optional qualifier segment may sit between the family and the colour: a border side or
    // axis, a divide axis, a ring offset. Without it, `border-t-purple-500` and
    // `ring-offset-red-500` - both real Tailwind colour forms - would slip through the very gap
    // this extension exists to close. It cannot widen the guard's aim: a qualifier only counts
    // when a palette name and a shade still follow it.
    const stockQualifier = "(?:-(?:offset)|-[xytrblse])?";

    const stockPaletteUtility = new RegExp(
      `\\b(?:${colourUtilityPrefixes.join("|")})${stockQualifier}-(?:${stockPaletteNames.join("|")})-${stockShade}\\b`,
    );

    const forbidden = new RegExp(`${rawColour.source}|${stockPaletteUtility.source}`);

    // A pattern that cannot discriminate is a broken guard, not a strict one, so both
    // directions are pinned here. `transparent`, `current` and `inherit` are real Tailwind
    // colour keywords, and `vt-` is this app's own namespace: none of them is a stock palette
    // entry, so all of them must pass. A guard that fires on legitimate code is disabled by the
    // next person, which is worse than no guard. Samples are assembled from the two lists rather
    // than written out, so this file does not carry the very shapes it bans.
    for (const prefix of colourUtilityPrefixes) {
      for (const name of stockPaletteNames) {
        const utility = `${prefix}-${name}-500`;

        expect(stockPaletteUtility.test(utility), `${utility} must be banned`).toBe(true);
        expect(stockPaletteUtility.test(`hover:${utility}`), `hover:${utility} must be banned`).toBe(true);
        expect(
          stockPaletteUtility.test(`focus-visible:${utility}/40`),
          `focus-visible:${utility}/40 must be banned`,
        ).toBe(true);
      }
    }

    // The qualified forms of the families that have one, at the darkest and lightest shades
    // instead of only the 500 every entry above already covers.
    for (const name of stockPaletteNames) {
      for (const qualified of [
        `border-t-${name}-50`,
        `border-x-${name}-950`,
        `divide-y-${name}-100`,
        `ring-offset-${name}-700`,
      ]) {
        expect(stockPaletteUtility.test(qualified), `${qualified} must be banned`).toBe(true);
      }
    }

    expect(rawColour.test("#0b1220")).toBe(true);
    expect(rawColour.test("rgba(0,0,0,.35)")).toBe(true);
    expect(forbidden.test(`text-${"white"}`)).toBe(true);
    expect(forbidden.test(`bg-${"black"}`)).toBe(true);
    expect(forbidden.test(`bg-${stockPaletteNames[0]}-500`)).toBe(true);

    for (const allowed of [
      "text-vt-text",
      "bg-vt-accent",
      "bg-vt-accent/90",
      "border-vt-border-2",
      "border-vt-border/70",
      "ring-vt-accent",
      "outline-vt-accent",
      "from-vt-surface-2",
      "to-vt-accent-strong",
      "divide-vt-border",
      "accent-vt-accent",
      "shadow-vt-focus-ring",
      "text-vt-muted-2",
      "text-vt-success-soft-text",
      "border-vt-warn-soft-border",
      "bg-vt-background/80",
      "bg-transparent",
      "border-transparent",
      "text-current",
      "border-current",
      "text-inherit",
      "bg-[color:var(--color-vt-surface)]",
      // Non-colour utilities of the same families, including the qualified ones, must survive.
      "text-sm",
      "border-b",
      "border-t",
      "border-t-2",
      "divide-x",
      "divide-y",
      "ring-2",
      "ring-offset-2",
      "outline-offset-2",
      "shadow-lg",
    ]) {
      expect(forbidden.test(allowed), `${allowed} must NOT be reported`).toBe(false);
    }

    // Measured with THIS pattern and walker before it was admitted: of the 84 production TSX
    // files, exactly two lines were offenders - `features/public/PlayerDetailPage.tsx:38` and
    // `:39`, the `defense` and `reception` stat bars - and both were removed in the same change
    // that added this guard. Nothing else in the tree uses a stock-palette colour utility, so
    // the guard starts on a clean tree instead of on a backlog.
    const offenders: string[] = [];

    for (const filePath of guarded) {
      stripJsComments(readFileSync(filePath, "utf8"))
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
    // T11 then moved the public dashboard onto the design's own layers: its metrics block
    // (four legacy Cards) and the live/upcoming shells dropped both `bg-vt-panel` usages,
    // which took vt-panel to 71 occurrences in 38 files, so the ceiling moves with the drop.
    // vt-raised (46/26) and vt-raised-border (9/7) were untouched again and keep their
    // measured values.
    // T12/T13 then rebuilt the public matches screen, the tournaments list and the five
    // tournament detail routes: the app-only `bg-vt-panel` tiles and rows those screens were
    // built from moved onto the design's --surface / --surface-2 / --bg layers, and the
    // `border-vt-border bg-vt-raised` detail heroes moved onto the shared shell's structural
    // cards. Measured with this guard's own patterns and exclusions: vt-panel 61/31,
    // vt-raised 36/21, vt-raised-border 9/7 (unchanged, so its ceiling stays).
    // T14/T15 then built the public teams and players screens. The two new list tables are
    // rendered by the shared `DataTable` primitive, which still paints its own `vt-panel`
    // header and `vt-raised` body (+2 each), while the team and player detail screens those
    // slices restructured moved their own app-only tiles onto the design's --surface-2 and
    // --bg layers and dropped the player KPI cards' raised borders. Measured with this
    // guard's own patterns and exclusions: vt-panel 52/27, vt-raised 29/18, and
    // vt-raised-border unchanged at 9/7 (so its ceiling stays).
    // T16 then aligned the public live screen: its own hand-rolled status chip and its six
    // app-only `bg-vt-panel` stat/event rows moved onto the design's state pill and --surface
    // layers, the court's `border-vt-raised bg-vt-surface` card and
    // `border-vt-raised-border bg-vt-raised` graphic became the design's --surface card over
    // a --surface-2 court, and the three legacy uniform-padding Cards on the screen became
    // structural ones. Measured with this guard's own patterns and exclusions: vt-panel
    // 45/26, vt-raised 25/16, vt-raised-border 7/5, so every ceiling drops to its measured
    // value.
    // T17 then aligned the three admin screens. The staff screen became the design's combined
    // table + dialog, the players and matches lists moved onto the design's structural cards
    // and match-card surfaces, the three create forms replaced their `bg-vt-raised` form boxes
    // with `Card padded={false}`, and the shared `Modal` moved onto the design's --surface
    // panel with a --border edge (dropping its raised fill and raised border). Measured with
    // this guard's own patterns and exclusions: vt-panel 39/20, vt-raised 21/12,
    // vt-raised-border 6/4, so every ceiling drops to its measured value again.
    // T18 then aligned the admin tournament screens: the list, the create form, the new
    // overview, the new bracket route and the new edit route, plus the three content tabs,
    // which moved onto the shared tournament frame. The three tabs' hand-rolled headers,
    // their raised nav strips and the stats screen's app-only pill row and `bg-vt-panel`
    // leaderboard rows all left with them. Measured with this guard's own patterns and
    // exclusions: vt-panel 34/16, vt-raised 14/8, and vt-raised-border unchanged at 6/4 (so
    // its ceiling stays).
    // T19 then aligned the admin team screens: the list's own `bg-vt-panel` feedback block
    // left with the row actions the design does not have, the create screen's whole
    // app-only box (one `bg-vt-raised` section and five `bg-vt-panel` panels: the roster box,
    // its feedback line, the modal search, the assign list and its empty state) was replaced
    // by the design's structural cards and the shared field controls, and the four new admin
    // team detail routes render their tables through the shared `DataTable` (+1 each) and
    // their panels through the design's `--surface` / `--surface-2` layers. Measured with
    // this guard's own patterns and exclusions: vt-panel 28/14, vt-raised 13/7,
    // vt-raised-border 5/3, so every ceiling drops to its measured value.
    // T25 then aligned the planillero, which was the largest single `bg-vt-panel` consumer left:
    // the design's assigned-matches list is a `.match-list` of `--surface` match cards, its empty
    // state is the design's `.card.empty-state`, and the setup view uses the design's `--bg`
    // `.setup-team` blocks inside a structural card. Every one of the eight `bg-vt-panel`
    // occurrences the screen carried left with it. Measured with this guard's own patterns and
    // exclusions: vt-panel 20/13, vt-raised 13/7 and vt-raised-border 5/3 (both unchanged, so their
    // ceilings stay).
    // T26 migrated the four scoring screens' last legacy header (`SectionShell`) onto the shared
    // `PageHeader` primitive. The migration moves no app-only surface or border token, so the
    // measured counts are unchanged from T25. Re-measured with this guard's own patterns and
    // exclusions: vt-panel 19/12, vt-raised 13/7, vt-raised-border 5/3. vt-panel is one occurrence
    // and one file below its T25 ceiling, so the ceiling is tightened to the measured value; the
    // other two already sit exactly on their measured values and stay.
    // The colour-alignment slice that followed T26 removed the last app-only panel occurrence
    // from a public screen: the player ficha's hero banner, which the design renders as a
    // `--surface` card (frontend/design/html/voleytrack.css:75), moved off `bg-vt-panel`, and the
    // screen's breakdown tones that had exact design counterparts (`--blue`, `--success`) moved
    // off the raw Tailwind hues. Measured with this guard's own patterns and exclusions: vt-panel
    // 18/11, vt-raised 13/7, vt-raised-border 5/3, so vt-panel's ceiling drops to its measured
    // value and the other two stay on theirs.
    const ratchets = [
      { token: "vt-panel", pattern: "vt-panel(?![\\-\\w])", ceiling: 18, baselineFiles: 11 },
      { token: "vt-raised", pattern: "vt-raised(?![\\-\\w])", ceiling: 13, baselineFiles: 7 },
      { token: "vt-raised-border", pattern: "vt-raised-border", ceiling: 5, baselineFiles: 3 },
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
