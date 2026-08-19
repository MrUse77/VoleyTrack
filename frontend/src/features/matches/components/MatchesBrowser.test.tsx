import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MatchesBrowser } from "./MatchesBrowser";
import { MATCHES_BROWSER_VM } from "../matches.models";

const matchesBrowserPath = fileURLToPath(new URL("./MatchesBrowser.tsx", import.meta.url));
const dashboardRailPath = fileURLToPath(
  new URL("../../dashboard/components/DashboardRail.tsx", import.meta.url),
);

describe("MatchesBrowser", () => {
  it("renders the match center and filters", () => {
    const html = renderToStaticMarkup(
      <MatchesBrowser matchCenter={MATCHES_BROWSER_VM} />,
    );

    expect(html).toContain("ALL");
    expect(html).toContain("Brazil");
    expect(html).toContain("Completed");
  });

  it("uses canonical surface tokens and no white/black surfaces", () => {
    const source = readFileSync(matchesBrowserPath, "utf8");
    const railSource = readFileSync(dashboardRailPath, "utf8");

    for (const fileSource of [source, railSource]) {
      expect(fileSource).toContain("border-vt-border");
      expect(fileSource).toMatch(/bg-vt-(panel|surface)/);
      expect(fileSource).not.toContain("border-white/");
      expect(fileSource).not.toContain("bg-white/");
      expect(fileSource).not.toContain("bg-black/");
    }
  });

  it("renders canonical surface tokens without white/black surfaces", () => {
    const html = renderToStaticMarkup(<MatchesBrowser matchCenter={MATCHES_BROWSER_VM} />);

    expect(html).toContain("border-vt-border");
    expect(html).toMatch(/bg-vt-(panel|surface)/);
    expect(html).not.toContain("border-white/");
    expect(html).not.toContain("bg-white/");
    expect(html).not.toContain("bg-black/");
  });
});
