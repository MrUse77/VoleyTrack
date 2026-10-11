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

const tokensPath = fileURLToPath(new URL("./tokens.css", import.meta.url));
const indexPath = fileURLToPath(new URL("../index.css", import.meta.url));
const publicShellPath = fileURLToPath(new URL("../layouts/PublicShell.tsx", import.meta.url));
const adminShellPath = fileURLToPath(new URL("../layouts/AdminShell.tsx", import.meta.url));
const shellUtilityBarPath = fileURLToPath(new URL("../components/ShellUtilityBar.tsx", import.meta.url));
const navItemPath = fileURLToPath(new URL("../components/ui/NavItem.tsx", import.meta.url));
const shellTopbarPath = fileURLToPath(new URL("../components/ShellTopbar.tsx", import.meta.url));
const scoringConsolePath = fileURLToPath(new URL("../features/scoring/ScoringConsolePage.tsx", import.meta.url));
const placeholderPagePath = fileURLToPath(new URL("../pages/PlaceholderPage.tsx", import.meta.url));
const adminPagePath = fileURLToPath(new URL("../pages/AdminPage.tsx", import.meta.url));
const loginPagePath = fileURLToPath(new URL("../pages/LoginPage.tsx", import.meta.url));
const planilleroPagePath = fileURLToPath(new URL("../pages/PlanilleroPage.tsx", import.meta.url));
const createTeamPagePath = fileURLToPath(new URL("../features/admin/CreateTeamPage.tsx", import.meta.url));
const playerDetailPath = fileURLToPath(new URL("../features/public/PlayerDetailPage.tsx", import.meta.url));
const playerSelectionModalPath = fileURLToPath(new URL("../features/scoring/PlayerSelectionModal.tsx", import.meta.url));
const matchSetupPath = fileURLToPath(new URL("../features/scoring/MatchSetupPage.tsx", import.meta.url));
const pointEntryPath = fileURLToPath(new URL("../features/scoring/PointEntryPage.tsx", import.meta.url));
const postMatchSummaryPath = fileURLToPath(new URL("../features/scoring/PostMatchSummaryPage.tsx", import.meta.url));
const scoringFixturePath = fileURLToPath(new URL("../fixtures/scoring.ts", import.meta.url));
const dashboardHeroPath = fileURLToPath(new URL("../features/dashboard/components/DashboardHero.tsx", import.meta.url));

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

  it("normalizes ShellUtilityBar, NavItem and ShellTopbar to canonical surface tokens without white/black leaks", () => {
    for (const filePath of [shellUtilityBarPath, navItemPath, shellTopbarPath]) {
      const source = readFileSync(filePath, "utf8");

      expect(source).toMatch(/bg-vt-(panel|surface)/);
      expect(source).not.toContain("border-white/");
      expect(source).not.toContain("bg-white/");
      expect(source).not.toContain("bg-black/");
    }

    expect(readFileSync(shellUtilityBarPath, "utf8")).toContain("border-vt-border");
    expect(readFileSync(shellTopbarPath, "utf8")).toContain("border-vt-border");
    expect(readFileSync(shellTopbarPath, "utf8")).toContain("bg-vt-surface");
    expect(readFileSync(shellUtilityBarPath, "utf8")).toContain("bg-vt-panel");
  });

  it("normalizes generic page surfaces to canonical tokens without white/black leaks", () => {
    for (const filePath of [scoringConsolePath, placeholderPagePath, adminPagePath, loginPagePath, planilleroPagePath]) {
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
    expect(readFileSync(loginPagePath, "utf8")).toContain("bg-vt-panel");
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
    for (const filePath of [playerDetailPath, playerSelectionModalPath, matchSetupPath, scoringConsolePath, pointEntryPath, dashboardHeroPath]) {
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

    const hero = readFileSync(dashboardHeroPath, "utf8");
    expect(hero).toContain("via-vt-surface");
    expect(hero).toMatch(/from-vt-(panel|surface)/);
    expect(hero).toMatch(/to-vt-(background|panel)/);
    expect(hero).not.toContain("from-slate-900");
    expect(hero).not.toContain("to-slate-950");
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
    const guardPath = resolve(fileURLToPath(import.meta.url));
    const sourceFiles = collectSourceFiles(srcRootPath).filter((filePath) => resolve(filePath) !== guardPath);

    expect(sourceFiles.length).toBeGreaterThan(0);

    const offenders: string[] = [];

    for (const filePath of sourceFiles) {
      readFileSync(filePath, "utf8")
        .split("\n")
        .forEach((line, index) => {
          if (line.includes("vt-canvas")) {
            offenders.push(`${filePath.slice(srcRootPath.length)}:${index + 1}`);
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
});
