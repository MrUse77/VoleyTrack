import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ScreenOneMatches } from "./ScreenOneMatches";
import { SCREEN_ONE_MATCHES_VM } from "../screen-one.models";

describe("ScreenOneMatches", () => {
  it("renders the match filters and sections", () => {
    const html = renderToStaticMarkup(
      <ScreenOneMatches matchCenter={SCREEN_ONE_MATCHES_VM.matchCenter} />,
    );

    expect(html).toContain("Match Center");
    expect(html).toContain("ALL");
    expect(html).toContain("Brazil");
    expect(html).toContain("Completed");
  });
});
