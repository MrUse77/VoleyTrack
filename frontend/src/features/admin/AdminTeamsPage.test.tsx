// @vitest-environment jsdom
import { act, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ADMIN } from "../../fixtures";
import { AdminTeamsPage } from "./AdminTeamsPage";

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
  act(() => root.render(<AdminTeamsPage />));
  return { container, root };
}

describe("AdminTeamsPage", () => {
  it("renders the fixture-driven teams table with canonical Spanish labels", () => {
    const html = renderToStaticMarkup(<AdminTeamsPage />);
    const text = visibleText(html);

    expect(text).toContain("Equipos");
    expect(text).toContain("Administrá y consultá los equipos registrados.");
    expect(text).toContain("Equipo");
    expect(text).toContain("Ciudad");
    expect(text).toContain("Entrenador");
    expect(text).toContain("Categoría");
    expect(text).toContain("Jugadores");
    expect(text).toContain("Estado");

    for (const team of ADMIN.teams) {
      expect(text).toContain(team.name);
      expect(text).toContain(team.city);
      expect(text).toContain(team.coach);
      expect(text).toContain(team.category);
      expect(text).toContain(String(team.playerCount));
      expect(text).toContain(team.statusLabel);
    }
  });

  it("exposes the primary create route and named row actions", () => {
    const html = renderToStaticMarkup(<AdminTeamsPage />);
    const team = ADMIN.teams[0];

    expect(html).toContain("+ Nuevo Equipo");
    expect(html).toContain('href="/admin/teams/create"');
    expect(html).toContain("h-12");
    expect(html).toContain("w-[200px]");
    expect(html).toContain("max-w-full");
    expect(html).toContain("bg-vt-accent");
    expect(html).toContain("Acciones");
    expect(html).toContain("✏️ Editar");
    expect(html).toContain("🗑️ Borrar");
    expect(html).toContain(`aria-label="Ver ${team.name}"`);
    expect(html).toContain(`aria-label="Editar ${team.name}"`);
    expect(html).toContain(`aria-label="Eliminar ${team.name}"`);
  });

  it("confirms removal and reports that the local fixture was not persisted", () => {
    const rendered = renderPage();
    const team = ADMIN.teams[0];

    try {
      const removeButton = rendered.container.querySelector<HTMLButtonElement>(
        `button[aria-label="Eliminar ${team.name}"]`,
      );

      expect(removeButton).not.toBeNull();
      act(() => removeButton?.click());

      expect(rendered.container.textContent).toContain(`¿Eliminar ${team.name} solo de esta vista?`);
      expect(rendered.container.querySelector(`button[aria-label="Confirmar eliminación de ${team.name}"]`)).not.toBeNull();
      expect(rendered.container.querySelectorAll("tbody tr")).toHaveLength(ADMIN.teams.length);

      const confirmButton = rendered.container.querySelector<HTMLButtonElement>(
        `button[aria-label="Confirmar eliminación de ${team.name}"]`,
      );
      act(() => confirmButton?.click());

      expect(rendered.container.querySelectorAll("tbody tr")).toHaveLength(ADMIN.teams.length - 1);
      expect(rendered.container.querySelector('[role="status"]')?.textContent).toContain("No se guardaron cambios.");
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });
});
