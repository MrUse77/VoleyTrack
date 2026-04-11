import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DashboardLive } from "./DashboardLive";
import { DASHBOARD_HOME_VM } from "../dashboard.models";

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
});
