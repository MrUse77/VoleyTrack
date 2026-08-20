import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

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
      "#f8fafc",
      "#94a3b8",
      "#ff8c42",
      "#4caf50",
      "#f44336",
      "#243249",
    ]) {
      expect(tokens).toContain(value);
    }

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
});
