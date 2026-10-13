// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ScoringConsolePage } from "./ScoringConsolePage";

let search: Record<string, string> = {};
const navigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useLocation: () => ({ search }),
  useNavigate: () => navigate,
}));

describe("ScoringConsolePage", () => {
  beforeEach(() => {
    search = {};
    navigate.mockReset();
  });

  function renderPage() {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    act(() => root.render(<ScoringConsolePage />));
    return { container, root };
  }

  it("SSR renders the live scoreboard, current set, history, and operations controls", () => {
    const html = renderToStaticMarkup(<ScoringConsolePage />);

    expect(html).toContain("Planilla en vivo");
    expect(html).toContain("Rosario Central Vóley");
    expect(html).toContain("Club Atlético San Jorge");
    expect(html).toContain("2");
    expect(html).toContain("1");
    expect(html).toContain("Set 3");
    expect(html).toContain('aria-current="true"');
    expect(html).toContain("Sets ganados");
    expect(html).toContain('aria-label="Sets ganados: 1 a 1"');
    expect(html).toContain("Sets ganados 1 - 1");
    expect(html).toContain("Set 1");
    expect(html).toContain("Set 2");
    expect(html).toContain("En curso");
    expect(html).toContain('aria-label="Anotar punto para Rosario Central Vóley"');
    expect(html).toContain('aria-label="Anotar punto para Club Atlético San Jorge"');
    expect(html).toContain("Controles de seguridad");
    expect(html).toContain('aria-label="Deshacer último punto"');
    expect(html).toContain("Sustitución");
    expect(html).toContain('aria-live="polite"');
  });

  it("SSR renders the substitution modal from the canonical modal query", () => {
    search = { modal: "substitution" };

    const html = renderToStaticMarkup(<ScoringConsolePage />);

    expect(html).toContain('role="dialog"');
    expect(html).toContain("Sustitución - Equipo Local");
    expect(html).toContain("Jugador que SALE (en cancha)");
    expect(html).toContain("Jugador que ENTRA (banca)");
    expect(html).toContain("Camila Sosa");

    const container = document.createElement("div");
    container.innerHTML = html;
    const dialog = container.querySelector<HTMLElement>('[role="dialog"]');
    const dialogNameId = dialog?.getAttribute("aria-labelledby");

    expect(dialogNameId).toBeTruthy();
    expect(container.querySelector(`#${dialogNameId}`)?.textContent).toBe("Sustitución - Equipo Local");
  });

  it("updates only the local score and allows repeated point recording", () => {
    const { container, root } = renderPage();
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

  it("offers a safe local undo after a point and announces both actions", () => {
    const { container, root } = renderPage();
    const pointButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Anotar punto para Rosario Central Vóley"]',
    );
    const undoButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Deshacer último punto"]',
    );
    const homeScore = container.querySelector<HTMLElement>(
      '[aria-label="Puntaje de Rosario Central Vóley"]',
    );
    const liveStatus = container.querySelector<HTMLElement>('[role="status"]');

    expect(undoButton?.disabled).toBe(true);
    expect(liveStatus?.textContent).toContain("Listo para registrar");

    act(() => pointButton?.click());
    expect(homeScore?.textContent).toBe("3");
    expect(undoButton?.disabled).toBe(false);
    expect(liveStatus?.textContent).toContain("Punto para Rosario Central Vóley");

    act(() => undoButton?.click());
    expect(homeScore?.textContent).toBe("2");
    expect(undoButton?.disabled).toBe(true);
    expect(liveStatus?.textContent).toContain("Último punto deshecho");

    act(() => root.unmount());
    container.remove();
  });

  it("exposes both team court rotations and context", () => {
    const html = renderToStaticMarkup(<ScoringConsolePage />);
    const container = document.createElement("div");
    container.innerHTML = html;
    const court = container.querySelector<HTMLElement>('[role="img"]');

    expect(html).toContain("Rotación y cancha");
    expect(court?.getAttribute("aria-label")).toContain("Rosario Central Vóley");
    expect(court?.getAttribute("aria-label")).toContain("Club Atlético San Jorge");
    expect(court?.querySelector('[data-court-feature="net"]')?.getAttribute("aria-label")).toBe("Red central");
    expect(court?.querySelectorAll('[data-court-feature="attack-line"]')).toHaveLength(2);
    expect(court?.querySelectorAll('[data-court-spot="true"]')).toHaveLength(12);
    expect(html).toContain("Rotación actual");
    expect(html).toContain("Posición 4");
    expect(html).toContain("Posición 1");
    expect(html).toContain("Camila Sosa");
    expect(html).toContain("Lucía Ferreyra");
    expect(html).toContain("Valentina Ruiz");
  });

  it("opens and closes the substitution modal through the URL without losing other queries", () => {
    const { container, root } = renderPage();
    const trigger = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Abrir modal de sustitución"]',
    );

    expect(trigger?.getAttribute("aria-expanded")).toBe("false");
    act(() => trigger?.click());

    expect(navigate).toHaveBeenCalledTimes(1);
    const openSearch = navigate.mock.calls[0][0].search;
    expect(openSearch({ view: "scoreboard" })).toEqual({
      modal: "substitution",
      view: "scoreboard",
    });

    search = openSearch({ view: "scoreboard" });
    act(() => root.render(<ScoringConsolePage />));
    expect(container.querySelector('[role="dialog"]')).not.toBeNull();
    expect(
      container
        .querySelector<HTMLButtonElement>('button[aria-label="Abrir modal de sustitución"]')
        ?.getAttribute("aria-expanded"),
    ).toBe("true");

    act(() => {
      container.querySelector<HTMLButtonElement>('button[aria-label="Close modal"]')?.click();
    });

    expect(navigate).toHaveBeenCalledTimes(2);
    const closeSearch = navigate.mock.calls[1][0].search;
    expect(closeSearch(search)).toEqual({ view: "scoreboard" });

    act(() => root.unmount());
    container.remove();
  });

  it("keeps substitution selections local and resets them after a remount", () => {
    search = { modal: "substitution" };
    const first = renderPage();
    const leavingPlayer = first.container.querySelector<HTMLSelectElement>(
      'select[aria-label="Jugador que SALE (en cancha)"]',
    );
    const enteringPlayer = first.container.querySelector<HTMLSelectElement>(
      'select[aria-label="Jugador que ENTRA (banca)"]',
    );

    act(() => {
      if (leavingPlayer) {
        leavingPlayer.value = "jugadora-camila-sosa";
        leavingPlayer.dispatchEvent(new Event("change", { bubbles: true }));
      }
      if (enteringPlayer) {
        enteringPlayer.value = "jugadora-camila-sosa";
        enteringPlayer.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
    expect(leavingPlayer?.value).toBe("jugadora-camila-sosa");
    expect(enteringPlayer?.value).toBe("jugadora-camila-sosa");

    act(() => first.root.unmount());
    first.container.remove();

    const second = renderPage();
    const freshLeavingPlayer = second.container.querySelector<HTMLSelectElement>(
      'select[aria-label="Jugador que SALE (en cancha)"]',
    );
    const freshEnteringPlayer = second.container.querySelector<HTMLSelectElement>(
      'select[aria-label="Jugador que ENTRA (banca)"]',
    );
    expect(freshLeavingPlayer?.value).toBe("");
    expect(freshEnteringPlayer?.value).toBe("");

    act(() => second.root.unmount());
    second.container.remove();
  });
});
