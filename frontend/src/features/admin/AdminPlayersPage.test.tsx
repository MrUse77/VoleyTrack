// @vitest-environment jsdom
import { act, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ADMIN, PUBLIC_PLAYER_DETAILS } from "../../fixtures";
import { AdminPlayersPage } from "./AdminPlayersPage";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, ...props }: { to: string; children?: ReactNode } & ComponentPropsWithoutRef<"a">) => (
    <a {...props} href={to} />
  ),
}));

function visibleText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function renderPage() {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  act(() => root.render(<AdminPlayersPage />));
  return { container, root };
}

function getControlByLabel<Control extends HTMLInputElement | HTMLSelectElement>(
  container: HTMLElement,
  labelText: string,
) {
  const label = [...container.querySelectorAll("label")].find((candidate) => candidate.textContent === labelText);
  const controlId = label?.htmlFor;

  if (!controlId) {
    throw new Error(`Missing control label: ${labelText}`);
  }

  return container.querySelector<Control>(`#${controlId}`)!;
}

/** React-controlled selects cannot be pointed at a value the options do not offer. */
function selectImpossibleValue(select: HTMLSelectElement) {
  const option = document.createElement("option");
  option.value = "__probe__";
  option.textContent = "—";
  select.append(option);
  select.value = "__probe__";
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

describe("AdminPlayersPage", () => {
  it("renders the design's player table columns with the profile-derived measurements", () => {
    const html = renderToStaticMarkup(<AdminPlayersPage />);
    const text = visibleText(html);

    expect(text).toContain("Jugadores");
    expect(text).toContain("Jugador");
    expect(text).toContain("Equipo");
    expect(text).toContain("Posición");
    expect(text).toContain("Altura");
    expect(text).toContain("Pts");
    expect(text).toContain("Acciones");

    for (const player of ADMIN.players) {
      const detail = PUBLIC_PLAYER_DETAILS.find((item) => item.playerId === player.id);
      expect(text).toContain(player.fullName);
      expect(text).toContain(player.teamName);
      expect(text).toContain(player.position);
      expect(text).toContain(detail?.heightLabel ?? "—");
    }
  });

  it("exposes the create route, the filter toggle and the design's row action", () => {
    const html = renderToStaticMarkup(<AdminPlayersPage />);
    const player = ADMIN.players[0];

    expect(html).toContain("Crear jugador");
    expect(html).toContain('href="/admin/players/create"');
    expect(html).toContain('aria-controls="players-filter-panel"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('id="players-filter-panel"');
    // The design's panel starts `hidden`; the toggle is the only thing that reveals it.
    // Attribute order is React's, not the source's, so both orderings are accepted.
    expect(html).toMatch(/(?=[^>]*hidden)(?=[^>]*id="players-filter-panel")<div[^>]*>/);
    expect(html).toContain(`aria-label="Ver ficha de ${player.fullName} #${player.number}"`);
    expect(html).toContain(`href="/players/${player.id}"`);
    expect(html).toContain("Ver ficha →");
  });

  it("filters the table and swaps it for the design's empty state when nothing matches", () => {
    const rendered = renderPage();

    try {
      const container = rendered.container;
      expect(container.querySelectorAll("tbody tr")).toHaveLength(ADMIN.players.length);

      const position = getControlByLabel<HTMLSelectElement>(container, "Posición");
      act(() => {
        position.value = ADMIN.players[0].position;
        position.dispatchEvent(new Event("change", { bubbles: true }));
      });

      expect(container.querySelectorAll("tbody tr")).toHaveLength(1);
      expect(container.textContent).toContain("1 jugador");

      act(() => selectImpossibleValue(position));

      expect(container.querySelector("tbody")).toBeNull();
      expect(container.textContent).toContain("No se encontraron jugadores");
      expect(container.textContent).toContain("Prueba con otro equipo o una posición diferente.");
      expect(container.textContent).toContain("0 jugadores");

      act(() => {
        [...container.querySelectorAll("button")]
          .find((button) => button.textContent === "Limpiar filtros")
          ?.click();
      });

      expect(container.querySelectorAll("tbody tr")).toHaveLength(ADMIN.players.length);
      expect(container.textContent).toContain(`${ADMIN.players.length} jugadores`);
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });

  it("reveals the filter panel through its toggle's expanded state", () => {
    const rendered = renderPage();

    try {
      const toggle = rendered.container.querySelector<HTMLButtonElement>('[aria-controls="players-filter-panel"]')!;
      const panel = rendered.container.querySelector<HTMLElement>("#players-filter-panel")!;

      expect(panel.hasAttribute("hidden")).toBe(true);
      act(() => toggle.click());
      expect(toggle.getAttribute("aria-expanded")).toBe("true");
      expect(panel.hasAttribute("hidden")).toBe(false);
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });
});
