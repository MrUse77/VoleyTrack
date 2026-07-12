// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ScoringConsolePage } from "./ScoringConsolePage";

describe("ScoringConsolePage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("SSR renders the local scoring console with fixture teams and score", () => {
    const html = renderToStaticMarkup(<ScoringConsolePage />);

    expect(html).toContain("Planilla en vivo");
    expect(html).toContain("Rosario Central Vóley");
    expect(html).toContain("Club Atlético San Jorge");
    expect(html).toContain("2");
    expect(html).toContain("1");
    expect(html).toContain("Set 3");
    expect(html).toContain("Sustitución");
  });

  it("updates only the local score and allows repeated point recording", () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    act(() => root.render(<ScoringConsolePage />));

    const homeButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Anotar punto para Rosario Central Vóley"]',
    );
    const awayButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Anotar punto para Club Atlético San Jorge"]',
    );
    const homeScore = container.querySelector<HTMLElement>(
      '[aria-label="Puntaje de Rosario Central Vóley"]',
    );
    const awayScore = container.querySelector<HTMLElement>(
      '[aria-label="Puntaje de Club Atlético San Jorge"]',
    );
    expect(homeButton).not.toBeNull();
    expect(awayButton).not.toBeNull();
    expect(homeScore?.textContent).toBe("2");
    expect(awayScore?.textContent).toBe("1");

    act(() => homeButton?.click());
    expect(homeScore?.textContent).toBe("3");
    expect(awayScore?.textContent).toBe("1");

    const repeatedHomePoints = 30;
    act(() => {
      for (let index = 0; index < repeatedHomePoints; index += 1) homeButton?.click();
      awayButton?.click();
    });
    expect(homeScore?.textContent).toBe("33");
    expect(awayScore?.textContent).toBe("2");

    act(() => root.unmount());
    container.remove();
  });
});
