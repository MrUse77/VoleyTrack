// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_PLAYERS, SCORING } from "../../fixtures";
import { PointEntryPage } from "./PointEntryPage";

let search: Record<string, string> = {};

vi.mock("@tanstack/react-router", () => ({
  useLocation: () => ({ search }),
}));

describe("PointEntryPage", () => {
  beforeEach(() => {
    search = {};
  });

  function renderPage() {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    act(() => root.render(<PointEntryPage />));
    return { container, root };
  }

  it("SSR renders the first canonical step by default", () => {
    const html = renderToStaticMarkup(<PointEntryPage />);

    expect(html).toContain("Seleccionar equipo que anota");
    expect(html).toContain('aria-label="Siguiente paso"');
    expect(html).toContain("Siguiente");
    expect(html).not.toContain("Registrar acción");
  });

  it("renders four explicit stages with visible progress", () => {
    const html = renderToStaticMarkup(<PointEntryPage />);

    expect(html).toContain("Paso 1 de 4");
    expect(html).toContain('aria-label="Paso 1: Seleccionar equipo que anota"');
    expect(html).toContain('aria-label="Paso 2: Seleccionar jugador"');
    expect(html).toContain('aria-label="Paso 3: Seleccionar tipo de punto"');
    expect(html).toContain('aria-label="Paso 4: Revisar y confirmar punto"');
  });

  it("walks the point entry stages with keyboard-ready selection states and a confirmation summary", () => {
    const { container, root } = renderPage();
    const team = {
      id: SCORING.console.homeTeamId,
      name: SCORING.console.homeTeamName,
    };
    const player = PUBLIC_PLAYERS.find((candidate) => candidate.teamId === team.id);
    const nextButton = () => container.querySelector<HTMLButtonElement>('button[aria-label="Siguiente paso"]');
    const previousButton = () => container.querySelector<HTMLButtonElement>('button[aria-label="Paso anterior"]');
    const teamButton = container.querySelector<HTMLButtonElement>(
      `button[aria-label="Seleccionar ${team.name}"]`,
    );

    expect(player).toBeDefined();
    expect(teamButton?.getAttribute("aria-pressed")).toBe("false");
    expect(nextButton()?.disabled).toBe(true);

    act(() => teamButton?.click());

    expect(teamButton?.getAttribute("aria-pressed")).toBe("true");
    expect(nextButton()?.disabled).toBe(false);
    act(() => nextButton()?.click());

    expect(container.textContent).toContain("Seleccionar jugador");
    expect(previousButton()).not.toBeNull();
    const playerButton = container.querySelector<HTMLButtonElement>(
      `button[aria-label="Seleccionar ${player?.fullName}"]`,
    );
    expect(playerButton?.getAttribute("aria-pressed")).toBe("false");

    act(() => playerButton?.click());

    expect(playerButton?.getAttribute("aria-pressed")).toBe("true");
    act(() => nextButton()?.click());

    expect(container.textContent).toContain("Seleccionar tipo de punto");
    const pointTypeButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Seleccionar tipo de punto: Ataque punto"]',
    );
    expect(pointTypeButton?.getAttribute("aria-pressed")).toBe("false");

    act(() => pointTypeButton?.click());
    act(() => nextButton()?.click());

    expect(container.textContent).toContain("Revisar y confirmar punto");
    expect(container.textContent).toContain(team.name);
    expect(container.textContent).toContain(player?.fullName);
    expect(container.textContent).toContain("Ataque punto");

    const confirmButton = container.querySelector<HTMLButtonElement>('button[aria-label="Confirmar punto"]');
    expect(confirmButton).not.toBeNull();
    act(() => confirmButton?.click());
    expect(container.querySelector('[role="status"]')?.textContent).toContain("Punto confirmado");

    act(() => root.unmount());
    container.remove();
  });

  it("initializes from a valid canonical step query and resets invalid queries to the first step", () => {
    search = { step: "point-step-action" };
    expect(renderToStaticMarkup(<PointEntryPage />)).toContain("Registrar acción");

    search = { step: "not-a-step" };
    expect(renderToStaticMarkup(<PointEntryPage />)).toContain("Seleccionar equipo que anota");
  });

  it("advances only forward and disables Siguiente on the terminal step", () => {
    const { container, root } = renderPage();
    const nextButton = () =>
      [...container.getElementsByTagName("button")].find((button) => button.getAttribute("aria-label") === "Siguiente paso");
    const teamButton = container.querySelector<HTMLButtonElement>(
      `button[aria-label="Seleccionar ${SCORING.console.homeTeamName}"]`,
    );

    expect(nextButton()).toBeDefined();
    act(() => teamButton?.click());
    act(() => nextButton()?.click());

    expect(container.textContent).toContain("Registrar acción");
    expect(nextButton()?.disabled).toBe(true);

    act(() => root.unmount());
    container.remove();
  });

  it("resets to the first step after remounting without a valid step query", () => {
    const first = renderPage();
    act(() => first.container.querySelector<HTMLButtonElement>(
      `button[aria-label="Seleccionar ${SCORING.console.homeTeamName}"]`,
    )?.click());
    act(() =>
      [...first.container.getElementsByTagName("button")]
        .find((button) => button.getAttribute("aria-label") === "Siguiente paso")
        ?.click(),
    );
    expect(first.container.textContent).toContain("Registrar acción");
    act(() => first.root.unmount());
    first.container.remove();

    search = {};
    const second = renderPage();
    expect(second.container.textContent).toContain("Seleccionar equipo que anota");
    act(() => second.root.unmount());
    second.container.remove();
  });
});
