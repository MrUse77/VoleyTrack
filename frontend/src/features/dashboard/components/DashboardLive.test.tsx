import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DashboardLive } from "./DashboardLive";
import { DASHBOARD_HOME_VM } from "../dashboard.models";

const dashboardLivePath = fileURLToPath(new URL("./DashboardLive.tsx", import.meta.url));

describe("DashboardLive", () => {
  it("renders the dashboard live overview", () => {
    const html = renderToStaticMarkup(
      <DashboardLive
        hero={DASHBOARD_HOME_VM.hero}
        liveMatches={DASHBOARD_HOME_VM.liveMatches}
        spotlight="3 Matches"
      />,
    );

    expect(html).toContain("Brazil vs Italy");
    expect(html).toContain("Live matches");
    expect(html).toContain("World Cup");
  });

  it("uses canonical surface tokens and no white/black surfaces", () => {
    const source = readFileSync(dashboardLivePath, "utf8");

    expect(source).toMatch(/bg-vt-(panel|surface)/);
    expect(source).not.toContain("border-white/");
    expect(source).not.toContain("bg-white/");
    expect(source).not.toContain("bg-black/");
  });

  it("renders canonical surface tokens without white/black surfaces", () => {
    const html = renderToStaticMarkup(
      <DashboardLive
        hero={DASHBOARD_HOME_VM.hero}
        liveMatches={DASHBOARD_HOME_VM.liveMatches}
        spotlight="3 Matches"
      />,
    );

    expect(html).toContain("border-vt-border");
    expect(html).toMatch(/bg-vt-(panel|surface)/);
    expect(html).not.toContain("border-white/");
    expect(html).not.toContain("bg-white/");
    expect(html).not.toContain("bg-black/");
  });
});
