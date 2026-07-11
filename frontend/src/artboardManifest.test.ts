import { describe, expect, it } from "vitest";
import { ARTBOARD_MANIFEST } from "./artboardManifest";

describe("artboard manifest", () => {
  it("contains all 45 canonical artboards", () => {
    expect(ARTBOARD_MANIFEST).toHaveLength(45);
  });

  it("gives every artboard a non-empty name and route or entry", () => {
    for (const artboard of ARTBOARD_MANIFEST) {
      expect(artboard.name.trim()).not.toBe("");
      expect(artboard.route.trim()).not.toBe("");
    }
  });

  it("maps the public dashboard to the root route without retaining /dashboard", () => {
    const dashboard = ARTBOARD_MANIFEST.find((artboard) => artboard.index === 3);

    expect(dashboard?.route).toBe("/");
    const manifestRoutes: readonly string[] = ARTBOARD_MANIFEST.map((artboard) => artboard.route);

    expect(manifestRoutes).not.toContain("/dashboard");
  });
});
