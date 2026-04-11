import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { DashboardPage } from "./DashboardPage";

describe("DashboardPage", () => {
  it("renders the dashboard hero and live matches", () => {
    const html = renderToStaticMarkup(<DashboardPage />);

    expect(html).toContain("VoleyTrack overview");
    expect(html).toContain("Brazil vs Italy");
    expect(html).toContain("Live matches");
    expect(html).toContain("Trending Players");
  });
});
