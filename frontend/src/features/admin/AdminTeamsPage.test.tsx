// @vitest-environment jsdom
import { act, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ADMIN } from "../../fixtures";
import { AdminTeamsPage } from "./AdminTeamsPage";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ activeOptions: _exactMarking, to, ...props }: { activeOptions?: unknown; to: string; children?: ReactNode } & ComponentPropsWithoutRef<"a">) => {
    // `activeOptions` is the exactness option the app's own Link
    // (components/navigation/NavigationLink) always passes; a plain anchor has no such
    // attribute, so the option is consumed here instead of leaking into the markup.
    void _exactMarking;

    return <a {...props} href={to} />;
  },
}));

function visibleText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function renderPage() {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  act(() => root.render(<AdminTeamsPage />));
  return { container, root };
}

function setInputValue(input: HTMLInputElement, value: string) {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

describe("AdminTeamsPage", () => {
  it("renders the design's team columns over the admin fixture", () => {
    const html = renderToStaticMarkup(<AdminTeamsPage />);
    const text = visibleText(html);

    expect(text).toContain("Equipos");
    expect(text).toContain("Listado de equipos. Seleccioná un equipo para ver su detalle.");
    // Design: voleytrack-admin-equipos.html — the `.table-wrap` columns are
    // `Equipo | Torneo | Jugadores | PG / PP`, and the app's own Ciudad/Entrenador/Categoría/
    // Estado/Acciones columns left with the row actions the design does not have.
    expect(text).toContain("Equipo");
    expect(text).toContain("Torneo");
    expect(text).toContain("Jugadores");
    expect(text).toContain("PG / PP");
    expect(text).not.toContain("Ciudad");
    expect(text).not.toContain("Entrenador");
    expect(text).not.toContain("Categoría");
    expect(text).not.toContain("Acciones");

    for (const team of ADMIN.teams) {
      expect(text).toContain(team.name);
      expect(text).toContain(team.city);
      expect(text).toContain(String(team.playerCount));
    }
  });

  it("exposes the Filtros toggle, the create link and a named row link to the detail", () => {
    const html = renderToStaticMarkup(<AdminTeamsPage />);
    const team = ADMIN.teams[0];

    expect(html).toContain(">Filtros<");
    expect(html).toContain('aria-controls="teams-filter-panel"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain(">Crear equipo<");
    expect(html).toContain('href="/admin/teams/create"');
    // Design: `.table-wrap tbody tr[onclick]` opens the team detail; an anchor is the same
    // destination with link semantics instead of a click handler on a row.
    expect(html).toContain(`href="/admin/teams/${team.id}"`);
    expect(visibleText(html)).toContain(`${team.name} · ${team.city}`);
  });

  it("keeps the filter panel in the DOM and omits the Torneo select when no team carries a tournament", () => {
    const html = renderToStaticMarkup(<AdminTeamsPage />);

    expect(html).toContain('id="teams-filter-panel"');
    expect(html).toContain("hidden");
    expect(html).toContain('id="team-name-filter"');
    expect(html).toContain("Buscar por nombre");
    expect(html).toContain('id="team-results-count"');
    expect(html).toContain("Limpiar filtros");
    // The admin team fixture carries no tournament assignment, so the design's Torneo select
    // would render a control whose only option is the current value; it is omitted instead.
    expect(html).not.toContain('id="team-tournament-filter"');
  });

  it("filters the rows by name, reports the count and restores them when cleared", () => {
    const rendered = renderPage();
    const team = ADMIN.teams[0];

    try {
      const search = rendered.container.querySelector<HTMLInputElement>("#team-name-filter");
      expect(search).not.toBeNull();
      expect(rendered.container.querySelectorAll("tbody tr")).toHaveLength(ADMIN.teams.length);

      act(() => setInputValue(search!, "no-such-team"));
      expect(rendered.container.querySelectorAll("tbody tr")).toHaveLength(0);
      expect(rendered.container.querySelector("#team-results-count")?.textContent).toContain("0 equipos");
      expect(rendered.container.querySelector('[role="status"]')?.textContent).toContain("No se encontraron equipos");

      act(() => setInputValue(search!, "san jorge"));
      expect(rendered.container.querySelectorAll("tbody tr")).toHaveLength(1);
      expect(rendered.container.textContent).toContain(team.name);

      act(() =>
        [...rendered.container.querySelectorAll("button")]
          .find((button) => button.textContent === "Limpiar filtros")
          ?.click(),
      );
      expect(rendered.container.querySelectorAll("tbody tr")).toHaveLength(ADMIN.teams.length);
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });

  it("removed the app-only row actions the design does not have", () => {
    const html = renderToStaticMarkup(<AdminTeamsPage />);

    expect(html).not.toContain("✏️ Editar");
    expect(html).not.toContain("🗑️ Borrar");
    expect(html).not.toContain("solo de esta vista");
  });
});
