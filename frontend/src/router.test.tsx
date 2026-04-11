import { describe, expect, it } from "vitest";
import { router } from "./router";

describe("router", () => {
  it("exposes the expected top-level routes", () => {
    const paths = router.routeTree.children.map((route) => route.path);

    expect(paths).toContain("/");
    expect(paths).toContain("matches");
    expect(paths).toContain("results");
    expect(paths).toContain("stats");
    expect(paths).toContain("gallery");
    expect(paths).toContain("fantasy");
    expect(paths).toContain("players");
    expect(paths).toContain("teams");
  });
});
