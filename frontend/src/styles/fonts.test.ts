import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const indexPath = fileURLToPath(new URL("../index.css", import.meta.url));
const packageJsonPath = fileURLToPath(new URL("../../package.json", import.meta.url));

// Weights the vendored design pack actually uses (brand-spec: Inter 400-900,
// JetBrains Mono 500/700). Latin-only subset entries so the bundle ships only
// what a Spanish-language app needs.
const expectedFontImports = [
  '@import "@fontsource/inter/latin-400.css";',
  '@import "@fontsource/inter/latin-500.css";',
  '@import "@fontsource/inter/latin-600.css";',
  '@import "@fontsource/inter/latin-700.css";',
  '@import "@fontsource/inter/latin-800.css";',
  '@import "@fontsource/inter/latin-900.css";',
  '@import "@fontsource/jetbrains-mono/latin-500.css";',
  '@import "@fontsource/jetbrains-mono/latin-700.css";',
];

describe("design font loading", () => {
  it("self-hosts the Inter and JetBrains Mono weights used by the design via Fontsource", () => {
    expect(existsSync(indexPath)).toBe(true);

    const index = readFileSync(indexPath, "utf8");

    for (const specifier of expectedFontImports) {
      expect(index).toContain(specifier);
    }

    // Exactly these entries, so a removed or duplicated weight is caught.
    expect(index.match(/@fontsource\//g)).toHaveLength(expectedFontImports.length);
  });

  it("does not fall back to the all-subsets Fontsource entry points", () => {
    const index = readFileSync(indexPath, "utf8");

    for (const family of ["inter", "jetbrains-mono"]) {
      // Bare weight (all subsets) and index entry points are deliberately avoided.
      expect(index).not.toMatch(new RegExp(`@fontsource/${family}/\\d+(-italic)?\\.css`));
      expect(index).not.toContain(`@fontsource/${family}/index.css`);
    }

    // Guard against a silently disabled self-hosting setup.
    expect(index).not.toContain("fonts.googleapis.com");
    expect(index).not.toContain("fonts.gstatic.com");
  });

  it("declares both Fontsource families as runtime dependencies", () => {
    const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
      dependencies?: Record<string, string>;
    };

    expect(Object.keys(pkg.dependencies ?? {})).toContain("@fontsource/inter");
    expect(Object.keys(pkg.dependencies ?? {})).toContain("@fontsource/jetbrains-mono");
  });
});
