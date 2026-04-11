import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MatchesBrowser } from "./MatchesBrowser";
import { MATCHES_BROWSER_VM } from "../matches.models";

describe("MatchesBrowser", () => {
  it("renders the match center and filters", () => {
    const html = renderToStaticMarkup(
      <MatchesBrowser matchCenter={MATCHES_BROWSER_VM} />,
    );

    expect(html).toContain("ALL");
    expect(html).toContain("Brazil");
    expect(html).toContain("Completed");
  });
});
