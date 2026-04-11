import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ScreenOneHero } from "./ScreenOneHero";
import { SCREEN_ONE_DASHBOARD_VM } from "../screen-one.models";

describe("ScreenOneHero", () => {
  it("renders the match hero and set scores", () => {
    const html = renderToStaticMarkup(
      <ScreenOneHero hero={SCREEN_ONE_DASHBOARD_VM.hero} utility={SCREEN_ONE_DASHBOARD_VM.utility} />,
    );

    expect(html).toContain("Brazil vs Italy");
    expect(html).toContain("Set 4 · 24-22");
    expect(html).toContain("S1: 25-18");
  });
});
