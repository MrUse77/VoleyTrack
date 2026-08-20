// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_PLAYERS, SCORING, SCORING_ROSTER } from "../../fixtures";
import { MatchSetupPage } from "./MatchSetupPage";

const ROTATION_POSITIONS = [4, 3, 2, 5, 6, 1] as const;
let search: Record<string, string> = {};
const navigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useLocation: () => ({ search }),
  useNavigate: () => navigate,
}));

describe("MatchSetupPage setup flow", () => {
  beforeEach(() => {
    search = {};
    navigate.mockReset();
  });

  function renderPage() {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    act(() => root.render(<MatchSetupPage />));
    return { container, root };
  }

  function getNextButton(container: HTMLElement) {
    return [...container.querySelectorAll<HTMLButtonElement>("button")].find(
      (button) => button.textContent === "Siguiente",
    );
  }

  function assignPlayerToPosition(
    container: HTMLElement,
    teamName: string,
    position: number,
    playerId: string,
    playerName: string,
  ) {
    const positionButton = container.querySelector<HTMLButtonElement>(
      `button[aria-label="Asignar jugador a ${teamName}, posición ${position}"]`,
    );
    expect(positionButton).not.toBeNull();

    act(() => positionButton?.click());

    const playerButton = container.querySelector<HTMLButtonElement>(
      `button[aria-label="Asignar jugador ${playerName} a posición ${position}"]`,
    );
    expect(playerButton).not.toBeNull();
    expect(playerButton?.getAttribute("data-player-id")).toBe(playerId);

    act(() => playerButton?.click());
  }

  function completeLineups(container: HTMLElement) {
    for (const team of [SCORING.matchSetup.homeTeam, SCORING.matchSetup.awayTeam]) {
      const players = SCORING_ROSTER.filter((player) => player.teamId === team.id);
      ROTATION_POSITIONS.forEach((position, index) => {
        const player = players[index];
        if (!player) throw new Error(`Missing scoring fixture player for ${team.id} at index ${index}`);
        assignPlayerToPosition(container, team.name, position, player.id, player.fullName);
      });
    }
  }

  it("SSR renders the first setup step by default", () => {
    const html = renderToStaticMarkup(<MatchSetupPage />);

    expect(html).toContain("Seleccionar equipos");
    expect(html).toContain("Siguiente");
    expect(html).not.toContain("Configurar sets");
  });

  it("provides a frozen scoring roster with six distinct Spanish-position players per team", () => {
    expect(Object.isFrozen(SCORING_ROSTER)).toBe(true);
    expect(PUBLIC_PLAYERS).toHaveLength(2);
    expect(new Set(SCORING_ROSTER.map((player) => player.id)).size).toBe(12);

    for (const team of [SCORING.matchSetup.homeTeam, SCORING.matchSetup.awayTeam]) {
      const teamPlayers = SCORING_ROSTER.filter((player) => player.teamId === team.id);
      expect(teamPlayers).toHaveLength(6);
      expect(teamPlayers.every((player) => Object.isFrozen(player))).toBe(true);
      expect(new Set(teamPlayers.map((player) => player.id)).size).toBe(6);
      expect(teamPlayers.map((player) => player.position)).toEqual(expect.arrayContaining([
        "Armadora",
        "Punta receptora",
        "Opuesta",
        "Central",
      ]));
    }
  });

  it("renders both teams with six position assignments and a volleyball court preview", () => {
    const html = renderToStaticMarkup(<MatchSetupPage />);
    const setup = SCORING.matchSetup;

    expect(html).toContain(setup.homeTeam.name);
    expect(html).toContain(setup.awayTeam.name);
    for (const team of [setup.homeTeam, setup.awayTeam]) {
      expect(html).toContain(`Alineación titular - ${team.name}`);
      for (const position of ROTATION_POSITIONS) {
        expect(html).toContain(`Posición ${position}: Seleccionar`);
        expect(html).toContain(`data-testid="court-position-${team.id}-${position}"`);
      }
      expect(html).toContain(`data-testid="court-half-${team.id}"`);
      expect(html).toContain(`data-testid="court-attack-line-${team.id}"`);
    }
    expect(html).toContain("Vista previa de rotaciones");
    expect(html).toContain('data-testid="rotation-court"');
    expect(html).toContain('data-testid="court-net"');
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Cancha de vóley con dos mitades, red central, líneas de ataque y seis posiciones por equipo"');
  });

  it("prevents duplicate assignments while preserving the current assignment when editing", () => {
    const { container, root } = renderPage();
    const setup = SCORING.matchSetup;
    const player = SCORING_ROSTER.find((candidate) => candidate.teamId === setup.homeTeam.id);
    expect(player).toBeDefined();

    assignPlayerToPosition(container, setup.homeTeam.name, 4, player!.id, player!.fullName);

    const positionThreeButton = container.querySelector<HTMLButtonElement>(
      `button[aria-label="Asignar jugador a ${setup.homeTeam.name}, posición 3"]`,
    );
    act(() => positionThreeButton?.click());

    const duplicateButton = container.querySelector<HTMLButtonElement>(
      `button[data-player-id="${player!.id}"]`,
    );
    expect(duplicateButton?.disabled).toBe(true);
    expect(duplicateButton?.textContent).toContain("Ya asignada a posición 4");

    act(() => container.querySelector<HTMLButtonElement>('button[aria-label="Close modal"]')?.click());

    const positionFourButton = container.querySelector<HTMLButtonElement>(
      `button[aria-label="Asignar jugador a ${setup.homeTeam.name}, posición 4"]`,
    );
    act(() => positionFourButton?.click());

    const currentAssignmentButton = container.querySelector<HTMLButtonElement>(
      `button[aria-label="Asignar jugador ${player!.fullName} a posición 4"]`,
    );
    expect(currentAssignmentButton?.disabled).toBe(false);
    expect(currentAssignmentButton?.getAttribute("aria-pressed")).toBe("true");

    act(() => root.unmount());
    container.remove();
  });

  it("gates confirmation, navigation, and continuation until both lineups are complete and confirmed", () => {
    const { container, root } = renderPage();
    const confirmButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Confirmar alineaciones"]',
    );
    const nextButton = getNextButton(container);

    expect(confirmButton?.disabled).toBe(true);
    expect(nextButton?.disabled).toBe(true);
    expect(container.querySelector('button[aria-label="Continuar a la planilla"]')).toBeNull();
    expect(container.querySelector('[role="status"]')?.textContent).toContain("Faltan posiciones");

    completeLineups(container);

    expect(confirmButton?.disabled).toBe(false);
    expect(getNextButton(container)?.disabled).toBe(false);
    expect(container.querySelector('[role="status"]')?.textContent).toContain("alineaciones completas");
    expect(container.querySelector('button[aria-label="Continuar a la planilla"]')).toBeNull();

    act(() => getNextButton(container)?.click());
    expect(container.textContent).toContain("Configurar sets");
    expect(container.querySelector('button[aria-label="Continuar a la planilla"]')).toBeNull();

    act(() => getNextButton(container)?.click());
    expect(container.textContent).toContain("Confirmar partido");

    const finalConfirmButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Confirmar alineaciones"]',
    );
    const continueButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Continuar a la planilla"]',
    );
    expect(finalConfirmButton?.disabled).toBe(false);
    expect(continueButton?.disabled).toBe(true);

    act(() => finalConfirmButton?.click());
    expect(container.querySelector('[role="status"]')?.textContent).toContain("Configuración confirmada");
    expect(container.querySelector<HTMLButtonElement>('button[aria-label="Continuar a la planilla"]')?.disabled).toBe(false);

    act(() => container.querySelector<HTMLButtonElement>('button[aria-label="Continuar a la planilla"]')?.click());
    expect(container.querySelector('[role="status"]')?.textContent).toContain("Listo para continuar con la planilla");

    act(() => root.unmount());
    container.remove();
  });

  it("starts at the first setup step with forward-only navigation", () => {
    const { container, root } = renderPage();

    expect(container.textContent).toContain("Seleccionar equipos");
    expect(container.textContent).toContain("Elegí los equipos que disputan el partido.");
    expect(container.textContent).not.toContain("Configurar sets");
    expect(container.querySelector('button[aria-label="Previous step"]')).toBeNull();
    expect(getNextButton(container)?.disabled).toBe(true);

    completeLineups(container);

    act(() => getNextButton(container)?.click());
    expect(container.textContent).toContain("Configurar sets");
    expect(container.textContent).toContain("Definí la configuración de sets para este partido.");
    expect(container.textContent).not.toContain("Elegí los equipos que disputan el partido.");
    expect(container.querySelector('button[aria-label="Previous step"]')).toBeNull();

    act(() => getNextButton(container)?.click());

    expect(container.textContent).toContain("Confirmar partido");
    expect(container.textContent).toContain("Revisá los datos antes de comenzar la planilla.");
    expect(container.textContent).not.toContain("Definí la configuración de sets para este partido.");
    expect(getNextButton(container)?.disabled).toBe(true);
    expect(container.querySelector('button[aria-label="Previous step"]')).toBeNull();

    act(() => root.unmount());
    container.remove();
  });

  it("resets to the first step when the page is mounted again", () => {
    const first = renderPage();
    completeLineups(first.container);
    act(() => getNextButton(first.container)?.click());
    expect(first.container.textContent).toContain("Configurar sets");
    act(() => first.root.unmount());
    first.container.remove();

    const second = renderPage();
    expect(second.container.textContent).toContain("Seleccionar equipos");
    expect(second.container.textContent).not.toContain("Configurar sets");
    act(() => second.root.unmount());
    second.container.remove();
  });

  it("opens from the query and closes by removing only the modal query", () => {
    search = { modal: "player-selection", view: "setup" };
    const { container, root } = renderPage();

    expect(container.querySelector('[role="dialog"]')).not.toBeNull();

    act(() => {
      container.querySelector<HTMLButtonElement>('button[aria-label="Close modal"]')?.click();
    });

    expect(navigate).toHaveBeenCalledTimes(1);
    const updateSearch = navigate.mock.calls[0][0].search;
    expect(updateSearch(search)).toEqual({ view: "setup" });

    search = updateSearch(search);
    act(() => root.render(<MatchSetupPage />));
    expect(container.querySelector('[role="dialog"]')).toBeNull();

    act(() => root.unmount());
    container.remove();
  });

  it("opens the modal through navigation while preserving other query values", () => {
    const { container, root } = renderPage();
    const openButton = [...container.querySelectorAll("button")].find(
      (button) => button.textContent === "Seleccionar jugadores",
    );

    act(() => openButton?.click());

    expect(navigate).toHaveBeenCalledTimes(1);
    const updateSearch = navigate.mock.calls[0][0].search;
    expect(updateSearch({ view: "setup" })).toEqual({ view: "setup", modal: "player-selection" });

    act(() => root.unmount());
    container.remove();
  });
});
