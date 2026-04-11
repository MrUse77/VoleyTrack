import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MatchesPage } from "./MatchesPage";

describe("MatchesPage", () => {
  it("renders the match center and filters", () => {
    const html = renderToStaticMarkup(<MatchesPage />);

    expect(html).toContain("Match center");
    expect(html).toContain("ALL");
    expect(html).toContain("Brazil");
    expect(html).toContain("Completed");
  });
});
