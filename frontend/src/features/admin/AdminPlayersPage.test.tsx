// @vitest-environment jsdom
import { act, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ADMIN } from "../../fixtures";
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

describe("AdminPlayersPage", () => {
  it("renders the fixture-driven players table with canonical Spanish labels", () => {
    const html = renderToStaticMarkup(<AdminPlayersPage />);
    const text = visibleText(html);

    expect(text).toContain("Jugadores");
    expect(text).toContain("Administrá y consultá los jugadores registrados.");
    expect(text).toContain("Jugador");
    expect(text).toContain("Equipo");
    expect(text).toContain("Dorsal");
    expect(text).toContain("Posición");
    expect(text).toContain("Estado");

    for (const player of ADMIN.players) {
      expect(text).toContain(player.fullName);
      expect(text).toContain(player.teamName);
      expect(text).toContain(String(player.number));
      expect(text).toContain(player.position);
      expect(text).toContain(player.statusLabel);
    }
  });

  it("exposes the primary create route and named row actions", () => {
    const html = renderToStaticMarkup(<AdminPlayersPage />);
    const player = ADMIN.players[0];

    expect(html).toContain("+ Nuevo Jugador");
    expect(html).toContain('href="/admin/players/create"');
    expect(html).toContain("h-12");
    expect(html).toContain("w-[200px]");
    expect(html).toContain("max-w-full");
    expect(html).toContain("bg-vt-accent");
    expect(html).toContain("Acciones");
    expect(html).toContain("✏️ Editar");
    expect(html).toContain("🗑️ Borrar");
    expect(html).toContain(`aria-label="Ver ${player.fullName}"`);
    expect(html).toContain(`aria-label="Editar ${player.fullName}"`);
    expect(html).toContain(`aria-label="Eliminar ${player.fullName}"`);
  });

  it("confirms removal and reports that the local fixture was not persisted", () => {
    const rendered = renderPage();
    const player = ADMIN.players[0];

    try {
      const removeButton = rendered.container.querySelector<HTMLButtonElement>(
        `button[aria-label="Eliminar ${player.fullName}"]`,
      );

      expect(removeButton).not.toBeNull();
      act(() => removeButton?.click());

      expect(rendered.container.textContent).toContain(`¿Eliminar ${player.fullName} solo de esta vista?`);
      expect(rendered.container.querySelector(`button[aria-label="Confirmar eliminación de ${player.fullName}"]`)).not.toBeNull();
      expect(rendered.container.querySelectorAll("tbody tr")).toHaveLength(ADMIN.players.length);

      const confirmButton = rendered.container.querySelector<HTMLButtonElement>(
        `button[aria-label="Confirmar eliminación de ${player.fullName}"]`,
      );
      act(() => confirmButton?.click());

      expect(rendered.container.querySelectorAll("tbody tr")).toHaveLength(ADMIN.players.length - 1);
      expect(rendered.container.querySelector('[role="status"]')?.textContent).toContain("No se guardaron cambios.");
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });
});
