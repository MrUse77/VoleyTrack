// @vitest-environment jsdom
import { act, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ADMIN } from "../../fixtures";
import { AdminTournamentsPage } from "./AdminTournamentsPage";

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
  act(() => root.render(<AdminTournamentsPage />));
  return { container, root };
}

describe("AdminTournamentsPage", () => {
  it("renders the fixture-driven tournaments table with canonical Spanish labels", () => {
    const html = renderToStaticMarkup(<AdminTournamentsPage />);
    const text = visibleText(html);

    expect(text).toContain("Torneos");
    expect(text).toContain("Administrá y consultá los torneos registrados.");
    expect(text).toContain("Torneo");
    expect(text).toContain("Categoría");
    expect(text).toContain("Estado");
    expect(text).toContain("Fechas");
    expect(text).toContain("Sede");
    expect(text).toContain("Partidos");
    expect(text).toContain("Equipos");

    for (const tournament of ADMIN.tournaments) {
      expect(text).toContain(tournament.name);
      expect(text).toContain(tournament.category);
      expect(text).toContain(tournament.statusLabel);
      expect(text).toContain(tournament.dateLabel);
      expect(text).toContain(tournament.location);
      expect(text).toContain(tournament.matchesLabel);
      expect(text).toContain(tournament.teamsLabel);
    }
  });

  it("exposes the primary create route and named row actions", () => {
    const html = renderToStaticMarkup(<AdminTournamentsPage />);

    expect(html).toContain("+ Nuevo Torneo");
    expect(html).toContain('href="/admin/tournaments/create"');
    expect(html).toContain("h-12");
    expect(html).toContain("w-[200px]");
    expect(html).toContain("max-w-full");
    expect(html).toContain("bg-vt-accent");
    expect(html).toContain("Acciones");
    expect(html).toContain("✏️ Editar");
    expect(html).toContain("🗑️ Borrar");
    expect(html).toContain(`aria-label="Ver ${ADMIN.tournaments[0].name}"`);
    expect(html).toContain(`aria-label="Editar ${ADMIN.tournaments[0].name}"`);
    expect(html).toContain(`aria-label="Eliminar ${ADMIN.tournaments[0].name}"`);
  });

  it("confirms removal and reports that the local fixture was not persisted", () => {
    const rendered = renderPage();
    const tournament = ADMIN.tournaments[0];

    try {
      const removeButton = rendered.container.querySelector<HTMLButtonElement>(
        `button[aria-label="Eliminar ${tournament.name}"]`,
      );

      expect(removeButton).not.toBeNull();
      act(() => removeButton?.click());

      expect(rendered.container.textContent).toContain(`¿Eliminar ${tournament.name} solo de esta vista?`);
      expect(rendered.container.querySelector(`button[aria-label="Confirmar eliminación de ${tournament.name}"]`)).not.toBeNull();
      expect(rendered.container.querySelectorAll("tbody tr")).toHaveLength(ADMIN.tournaments.length);

      const confirmButton = rendered.container.querySelector<HTMLButtonElement>(
        `button[aria-label="Confirmar eliminación de ${tournament.name}"]`,
      );
      act(() => confirmButton?.click());

      expect(rendered.container.querySelectorAll("tbody tr")).toHaveLength(ADMIN.tournaments.length - 1);
      expect(rendered.container.querySelector('[role="status"]')?.textContent).toContain("No se guardaron cambios.");
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });
});
