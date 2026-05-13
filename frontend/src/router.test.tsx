import { describe, expect, it } from "vitest";
import { router } from "./router";

describe("router", () => {
  it("exposes the auth route and shell subtree", () => {
    const topLevelPaths = router.routeTree.children.map((route) => route.path);
    const shellRoute = router.routeTree.children.find((route) => route.id === "shell");
    const shellPaths = shellRoute?.children.map((route) => route.path);

    expect(topLevelPaths).toContain("login");
    expect(shellPaths).toContain("/");
    expect(shellPaths).toContain("/admin");
    expect(shellPaths).toContain("/planillero");
    expect(shellPaths).toContain("/matches");
    expect(shellPaths).toContain("/results");
    expect(shellPaths).toContain("/stats");
    expect(shellPaths).toContain("/gallery");
    expect(shellPaths).toContain("/fantasy");
    expect(shellPaths).toContain("/players");
    expect(shellPaths).toContain("/teams");
  });
});
