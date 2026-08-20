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

describe("AdminMatchesPage", () => {
  it("renders the fixture-driven matches table with canonical Spanish labels", () => {
    const html = renderToStaticMarkup(<AdminMatchesPage />);
    const text = visibleText(html);

    expect(text).toContain("Partidos");
    expect(text).toContain("Administrá y consultá los partidos registrados.");
    expect(text).toContain("Estado");
    expect(text).toContain("Fecha y hora");
    expect(text).toContain("Equipo local");
    expect(text).toContain("Equipo visitante");
    expect(text).toContain("Sede");

    for (const match of ADMIN.matches) {
      expect(text).toContain(match.statusLabel);
      expect(text).toContain(match.scheduledLabel);
      expect(text).toContain(match.homeTeamName);
      expect(text).toContain(match.awayTeamName);
      expect(text).toContain(match.venue);
    }
  });

  it("exposes the primary create route and named row actions", () => {
    const html = renderToStaticMarkup(<AdminMatchesPage />);
    const match = ADMIN.matches[0];
    const matchLabel = `${match.homeTeamName} vs ${match.awayTeamName}`;

    expect(html).toContain("+ Programar Partido");
    expect(html).toContain('href="/admin/matches/create"');
    expect(html).toContain("h-12");
    expect(html).toContain("w-[200px]");
    expect(html).toContain("max-w-full");
    expect(html).toContain("bg-vt-accent");
    expect(html).toContain("Acciones");
    expect(html).toContain("✏️ Editar");
    expect(html).toContain("🗑️ Borrar");
    expect(html).toContain(`aria-label="Ver ${matchLabel}"`);
    expect(html).toContain(`aria-label="Editar ${matchLabel}"`);
    expect(html).toContain(`aria-label="Eliminar ${matchLabel}"`);
  });

  it("confirms removal and reports that the local fixture was not persisted", () => {
    const rendered = renderPage();
    const match = ADMIN.matches[0];
    const matchLabel = `${match.homeTeamName} vs ${match.awayTeamName}`;

    try {
      const removeButton = rendered.container.querySelector<HTMLButtonElement>(
        `button[aria-label="Eliminar ${matchLabel}"]`,
      );

      expect(removeButton).not.toBeNull();
      act(() => removeButton?.click());

      expect(rendered.container.textContent).toContain(`¿Eliminar ${matchLabel} solo de esta vista?`);
      expect(rendered.container.querySelector(`button[aria-label="Confirmar eliminación de ${matchLabel}"]`)).not.toBeNull();
      expect(rendered.container.querySelectorAll("tbody tr")).toHaveLength(ADMIN.matches.length);

      const confirmButton = rendered.container.querySelector<HTMLButtonElement>(
        `button[aria-label="Confirmar eliminación de ${matchLabel}"]`,
      );
      act(() => confirmButton?.click());

      expect(rendered.container.querySelectorAll("tbody tr")).toHaveLength(ADMIN.matches.length - 1);
      expect(rendered.container.querySelector('[role="status"]')?.textContent).toContain("No se guardaron cambios.");
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });
});
