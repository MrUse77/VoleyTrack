// @vitest-environment jsdom
import { act, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ADMIN } from "../../fixtures";
import { AdminTournamentsPage } from "./AdminTournamentsPage";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ activeOptions: _exactMarking, to, ...props }: { activeOptions?: unknown; to: string; children?: ReactNode } & ComponentPropsWithoutRef<"a">) => {
    // `activeOptions` is the exactness option the app's own Link
    // (components/navigation/NavigationLink) always passes; a plain anchor has no such
    // attribute, so the option is consumed here instead of leaking into the markup.
    void _exactMarking;

    return <a {...props} href={to} />;
  },
}));

const [league, cup] = ADMIN.tournaments;

function visibleText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function renderPage() {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  act(() => root.render(<AdminTournamentsPage />));
  return { container, root };
}

function getControlByLabel<Control extends HTMLInputElement | HTMLSelectElement>(
  container: HTMLElement,
  labelText: string,
) {
  const label = [...container.querySelectorAll("label")].find((candidate) => candidate.textContent === labelText);
  const controlId = label?.htmlFor;

  if (!controlId) throw new Error(`Missing control label: ${labelText}`);
  return container.querySelector<Control>(`#${controlId}`)!;
}

function setSelectValue(select: HTMLSelectElement, value: string) {
  select.value = value;
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

describe("AdminTournamentsPage", () => {
  it("renders the design's tournament cards with the type, state, figures and detail link", () => {
    const html = renderToStaticMarkup(<AdminTournamentsPage />);
    const text = visibleText(html);

    expect(text).toContain("Torneos");
    expect(text).toContain("Administrá y consultá los torneos registrados.");
    expect(html).toContain('data-testid="admin-tournament-card"');
    expect(html).toContain('href="/admin/tournaments/liga-rosarina-apertura-2026"');
    expect(html).toContain('href="/admin/tournaments/copa-litoral-2026"');

    for (const tournament of ADMIN.tournaments) {
      expect(text).toContain(tournament.name);
      expect(text).toContain(tournament.statusLabel);
      expect(text).toContain(tournament.detail.typeLabel);
      expect(text).toContain(tournament.dateLabel);
      expect(text).toContain(tournament.matchesLabel);
      expect(text).toContain(tournament.teamsLabel);
    }
  });

  it("exposes the design's filter toggle, create action and result count", () => {
    const html = renderToStaticMarkup(<AdminTournamentsPage />);

    expect(html).toContain("Filtros");
    expect(html).toContain('aria-controls="tournaments-filter-panel"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('id="tournaments-filter-panel"');
    expect(html).toContain("hidden");
    expect(html).toContain("Crear torneo");
    expect(html).toContain('href="/admin/tournaments/create"');
    expect(html).toContain("Todos los tipos");
    expect(html).toContain("Todos los estados");
    expect(html).toContain(`${ADMIN.tournaments.length} torneos`);
  });

  it("keeps the design's list free of row actions: the card itself is the detail link", () => {
    const html = renderToStaticMarkup(<AdminTournamentsPage />);

    expect(html).not.toContain("Acciones");
    expect(html).not.toContain("🗑️ Borrar");
    expect(html).not.toContain("✏️ Editar");
  });

  it("filters by type and state, clears them, and announces an empty result", () => {
    const rendered = renderPage();

    try {
      const cards = () => rendered.container.querySelectorAll('[data-testid="admin-tournament-card"]');
      const countLine = () => rendered.container.querySelector('#tournaments-results-count');

      expect(cards()).toHaveLength(ADMIN.tournaments.length);
      expect(countLine()?.textContent).toContain(`${ADMIN.tournaments.length} torneos`);

      const typeSelect = getControlByLabel<HTMLSelectElement>(rendered.container, "Tipo");
      act(() => setSelectValue(typeSelect, cup.detail.typeLabel));

      expect(cards()).toHaveLength(1);
      expect(rendered.container.textContent).toContain(cup.name);
      expect(rendered.container.textContent).not.toContain(league.name);

      const statusSelect = getControlByLabel<HTMLSelectElement>(rendered.container, "Estado");
      act(() => setSelectValue(statusSelect, league.statusLabel));

      expect(rendered.container.querySelector('[data-testid="admin-tournament-card"]')).toBeNull();
      expect(rendered.container.querySelector('[role="status"]')?.textContent).toContain("No se encontraron torneos");
      expect(countLine()?.textContent).toContain("0 torneos");

      const clear = [...rendered.container.querySelectorAll("button")].find(
        (button) => button.textContent === "Limpiar filtros",
      );
      act(() => clear?.click());

      expect(typeSelect.value).toBe("todos");
      expect(statusSelect.value).toBe("todos");
      expect(cards()).toHaveLength(ADMIN.tournaments.length);
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });
});
