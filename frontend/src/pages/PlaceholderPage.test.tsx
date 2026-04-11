import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { PlaceholderPage } from "./PlaceholderPage";

describe("PlaceholderPage", () => {
  it("renders the placeholder copy", () => {
    const html = renderToStaticMarkup(
      <PlaceholderPage title="Results" description="Match results coming soon." />,
    );

    expect(html).toContain("Results");
    expect(html).toContain("Match results coming soon.");
    expect(html).toContain("reserved for the next rebuild batch");
  });
});
