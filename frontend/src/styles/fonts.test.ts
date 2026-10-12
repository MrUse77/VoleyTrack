import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const indexPath = fileURLToPath(new URL("../index.css", import.meta.url));
const fontsPath = fileURLToPath(new URL("./fonts.css", import.meta.url));
const packageJsonPath = fileURLToPath(new URL("../../package.json", import.meta.url));

// Weights the vendored design pack actually uses (brand-spec: Inter 400-900,
// JetBrains Mono 500/700), each against the latin-only `.woff2` Fontsource ships.
// Latin-only because the app is Spanish-language, and `.woff2`-only because every engine
// that can run this stack supports it: Fontsource's `latin-*.css` entries also emit a
// legacy `.woff` per face, which measured 242,952 of the 431,736 bytes the build used to
// ship (56% of the payload) purely as a dead fallback.
const expectedFaces: Array<[string, number, string]> = [
  ["Inter", 400, "@fontsource/inter/files/inter-latin-400-normal.woff2"],
  ["Inter", 500, "@fontsource/inter/files/inter-latin-500-normal.woff2"],
  ["Inter", 600, "@fontsource/inter/files/inter-latin-600-normal.woff2"],
  ["Inter", 700, "@fontsource/inter/files/inter-latin-700-normal.woff2"],
  ["Inter", 800, "@fontsource/inter/files/inter-latin-800-normal.woff2"],
  ["Inter", 900, "@fontsource/inter/files/inter-latin-900-normal.woff2"],
  ["JetBrains Mono", 500, "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2"],
  ["JetBrains Mono", 700, "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff2"],
];

type Face = { family: string; weight: number; src: string };

// Prose in the declaration file legitimately mentions `.woff` while explaining why the
// fallback was dropped, so declarations are checked with comments removed.
const withoutComments = (source: string) => source.replace(/\/\*[\s\S]*?\*\//g, "");

function parseFaces(source: string): Face[] {
  return [...withoutComments(source).matchAll(/@font-face\s*\{([^}]*)\}/g)].map((match) => {
    const block = match[1];
    const read = (property: string) => {
      const found = new RegExp(`${property}\\s*:\\s*([^;]+);`).exec(block);
      return (found?.[1] ?? "").trim().replace(/^["']|["']$/g, "");
    };

    return {
      family: read("font-family"),
      weight: Number(read("font-weight")),
      src: read("src"),
    };
  });
}

describe("design font loading", () => {
  it("self-hosts the Inter and JetBrains Mono weights used by the design", () => {
    expect(existsSync(indexPath)).toBe(true);
    expect(existsSync(fontsPath)).toBe(true);

    const index = readFileSync(indexPath, "utf8");
    const fonts = readFileSync(fontsPath, "utf8");

    // index.css pulls in the local declaration file and no Fontsource CSS entry point.
    expect(index).toContain('@import "./styles/fonts.css";');
    expect(index).not.toContain("@fontsource/");

    // Both families are declared, at exactly the eight weights the design uses.
    const faces = parseFaces(fonts);
    expect(faces).toHaveLength(expectedFaces.length);
    for (const [family, weight, src] of expectedFaces) {
      expect(faces).toContainEqual({ family, weight, src: expect.stringContaining(src) });
    }

    // Guard against a silently disabled self-hosting setup.
    expect(index).not.toContain("fonts.googleapis.com");
    expect(index).not.toContain("fonts.gstatic.com");
    expect(fonts).not.toContain("fonts.googleapis.com");
    expect(fonts).not.toContain("fonts.gstatic.com");
  });

  it("declares .woff2 only, never Fontsource's legacy .woff fallback", () => {
    const declarations = withoutComments(readFileSync(fontsPath, "utf8"));

    // Every face resolves through a package-relative specifier so Vite bundles the
    // binary from node_modules into a hashed local /assets URL (verified by the build).
    for (const face of parseFaces(declarations)) {
      expect(face.src).toMatch(/^url\("@fontsource\/[^"]+"\)\s*format\("woff2"\)$/);
    }

    // The regression this guards: re-adding a `.woff` src re-ships the 242,952 bytes.
    expect(declarations).not.toMatch(/\.woff(?!2)/);
    expect(declarations).not.toContain('format("woff")');
  });

  it("declares both Fontsource families as runtime dependencies", () => {
    const pkg = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
      dependencies?: Record<string, string>;
    };

    expect(Object.keys(pkg.dependencies ?? {})).toContain("@fontsource/inter");
    expect(Object.keys(pkg.dependencies ?? {})).toContain("@fontsource/jetbrains-mono");
  });
});
