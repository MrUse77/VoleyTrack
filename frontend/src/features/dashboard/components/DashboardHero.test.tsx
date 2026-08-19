import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DashboardHero } from "./DashboardHero";
import { DASHBOARD_HOME_VM } from "../dashboard.models";

const dashboardHeroPath = fileURLToPath(new URL("./DashboardHero.tsx", import.meta.url));

describe("DashboardHero", () => {
  it("renders the hero scoreboard", () => {
    const html = renderToStaticMarkup(
      <DashboardHero hero={DASHBOARD_HOME_VM.hero} spotlight="3 Matches" />,
    );

    expect(html).toContain("Brazil vs Italy");
    expect(html).toContain("Set 4 · 24-22");
    expect(html).toContain("Ver transmisión");
  });

  it("uses canonical surface tokens and no white/black surfaces", () => {
    const source = readFileSync(dashboardHeroPath, "utf8");

    expect(source).toContain("border-vt-border");
    expect(source).toMatch(/bg-vt-(panel|surface)/);
    expect(source).not.toContain("border-white/");
    expect(source).not.toContain("bg-white/");
    expect(source).not.toContain("bg-black/");
  });

  it("renders canonical surface tokens without white/black surfaces", () => {
    const html = renderToStaticMarkup(<DashboardHero hero={DASHBOARD_HOME_VM.hero} spotlight="3 Matches" />);

    expect(html).toContain("border-vt-border");
    expect(html).toMatch(/bg-vt-(panel|surface)/);
    expect(html).not.toContain("border-white/");
    expect(html).not.toContain("bg-white/");
    expect(html).not.toContain("bg-black/");
  });
});
