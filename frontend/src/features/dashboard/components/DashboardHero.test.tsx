import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DashboardHero } from "./DashboardHero";
import { DASHBOARD_HOME_VM } from "../dashboard.models";

describe("DashboardHero", () => {
  it("renders the hero scoreboard", () => {
    const html = renderToStaticMarkup(
      <DashboardHero hero={DASHBOARD_HOME_VM.hero} spotlight="3 Matches" />,
    );

    expect(html).toContain("Brazil vs Italy");
    expect(html).toContain("Set 4 · 24-22");
    expect(html).toContain("Ver transmisión");
  });
});
