import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const tokensPath = fileURLToPath(new URL("./tokens.css", import.meta.url));
const indexPath = fileURLToPath(new URL("../index.css", import.meta.url));

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
    expect(index).toContain("min-width: 1440px");
  });
});
