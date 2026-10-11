// @vitest-environment jsdom
import { act, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ADMIN } from "../../fixtures";
import { AdminMatchesPage } from "./AdminMatchesPage";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, ...props }: { to: string; children?: ReactNode } & ComponentPropsWithoutRef<"a">) => (
    <a {...props} href={to} />
  ),
}));

const match = ADMIN.matches[0];

function visibleText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function renderPage() {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  act(() => root.render(<AdminMatchesPage />));
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

function selectImpossibleValue(select: HTMLSelectElement) {
  const option = document.createElement("option");
  option.value = "__probe__";
  option.textContent = "—";
  select.append(option);
  select.value = "__probe__";
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

describe("AdminMatchesPage", () => {
  it("renders the design's match cards with the tournament, schedule and state pill", () => {
    const html = renderToStaticMarkup(<AdminMatchesPage />);
    const text = visibleText(html);

    expect(text).toContain("Partidos");
    expect(text).toContain("Consulta la programación y gestiona los partidos creados.");
    expect(text).toContain(`${match.homeTeamName} vs ${match.awayTeamName}`);
    expect(text).toContain(match.tournamentName);
    expect(text).toContain(match.scheduledLabel);
    expect(text).toContain("Datos de referencia");
    expect(text).toContain("Estado: En vivo");
    expect(html).toContain('data-status="envivo"');
  });

  it("exposes the create route and the design's filter toggle", () => {
    const html = renderToStaticMarkup(<AdminMatchesPage />);

    expect(html).toContain("Crear partido");
    expect(html).toContain('href="/admin/matches/create"');
    expect(html).toContain('aria-controls="matches-filter-panel"');
    expect(html).toContain('aria-expanded="false"');
    // Attribute order is React's, not the source's, so both orderings are accepted.
    expect(html).toMatch(/(?=[^>]*hidden)(?=[^>]*id="matches-filter-panel")<div[^>]*>/);
    expect(html).toContain("Todos los torneos");
    expect(html).toContain("Todos los equipos");
    expect(html).toContain("Todos los estados");
    expect(html).toContain("Limpiar filtros");
  });

  it("filters the list and swaps it for the design's empty state when nothing matches", () => {
    const rendered = renderPage();

    try {
      const container = rendered.container;
      expect(container.querySelectorAll("li article")).toHaveLength(ADMIN.matches.length);
      expect(container.textContent).toContain(`${ADMIN.matches.length} partido`);

      const status = getControlByLabel<HTMLSelectElement>(container, "Estado");
      act(() => selectImpossibleValue(status));

      expect(container.querySelectorAll("li article")).toHaveLength(0);
      expect(container.textContent).toContain("No hay partidos para mostrar");
      expect(container.textContent).toContain("Cambia los filtros o crea un nuevo partido.");
      expect(container.textContent).toContain("0 partidos");

      act(() => {
        [...container.querySelectorAll("button")]
          .find((button) => button.textContent === "Limpiar filtros")
          ?.click();
      });

      expect(container.querySelectorAll("li article")).toHaveLength(ADMIN.matches.length);
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });

  it("reveals the filter panel through its toggle's expanded state", () => {
    const rendered = renderPage();

    try {
      const toggle = rendered.container.querySelector<HTMLButtonElement>('[aria-controls="matches-filter-panel"]')!;
      const panel = rendered.container.querySelector<HTMLElement>("#matches-filter-panel")!;

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
