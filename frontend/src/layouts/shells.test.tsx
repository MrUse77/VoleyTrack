import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  Outlet: () => <div data-route-content="true">Route content</div>,
}));

import { AdminShell } from "./AdminShell";
import { PublicShell } from "./PublicShell";
import { Sidebar, type SidebarNavigationGroup } from "../components/navigation/Sidebar";

const publicNavigation: SidebarNavigationGroup[] = [
  {
    items: [
      { href: "/dashboard", icon: "D", label: "Dashboard" },
      { href: "/matches", icon: "M", label: "Matches" },
    ],
  },
  {
    items: [{ href: "/teams", icon: "T", label: "Teams" }],
  },
];

const adminNavigation: SidebarNavigationGroup[] = [
  {
    items: [
      { href: "/admin/matches", icon: "M", label: "Matches" },
      { href: "/admin/players", icon: "P", label: "Players" },
    ],
  },
];

describe("application shells", () => {
  it("renders a public shell with a stable 248px sidebar and outlet content", () => {
    const html = renderToStaticMarkup(
      <PublicShell
        currentPath="/dashboard"
        navigation={publicNavigation}
        roleLabel="Public"
      />,
    );

    expect(html).toContain("w-[248px]");
    expect(html).toContain("VoleyTrack");
    expect(html).toContain("Public");
    expect(html).toContain("Dashboard");
    expect(html).toContain('aria-current="page"');
    expect(html).toContain("Route content");
  });

  it("renders an admin shell with context-specific navigation and outlet content", () => {
    const html = renderToStaticMarkup(
      <AdminShell
        currentPath="/admin/players"
        navigation={adminNavigation}
        roleLabel="Admin"
      />,
    );

    expect(html).toContain("w-[248px]");
    expect(html).toContain("VoleyTrack");
    expect(html).toContain("Admin");
    expect(html).toContain("Players");
    expect(html).toContain('href="/admin/players"');
    expect(html).toContain('aria-current="page"');
    expect(html).toContain("Route content");
  });

  it("keeps navigation structure stable while deriving the active link from the route", () => {
    const dashboard = renderToStaticMarkup(
      <Sidebar
        currentPath="/dashboard"
        navigation={publicNavigation}
        roleLabel="Public"
      />,
    );
    const matches = renderToStaticMarkup(
      <Sidebar
        currentPath="/matches"
        navigation={publicNavigation}
        roleLabel="Public"
      />,
    );
    const matchDetail = renderToStaticMarkup(
      <Sidebar
        currentPath="/matches/fixture-1"
        navigation={publicNavigation}
        roleLabel="Public"
      />,
    );

    for (const label of ["Dashboard", "Matches", "Teams"]) {
      expect(dashboard).toContain(label);
      expect(matches).toContain(label);
    }
    expect(dashboard).toMatch(/aria-current="page"[^>]*href="\/dashboard"/);
    expect(matches).toMatch(/aria-current="page"[^>]*href="\/matches"/);
    expect(matchDetail).toMatch(/aria-current="page"[^>]*href="\/matches"/);
    expect(matches).toContain('role="separator"');
  });
});
