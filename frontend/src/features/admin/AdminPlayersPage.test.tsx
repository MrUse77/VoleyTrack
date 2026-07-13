import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ADMIN } from "../../fixtures";
import { AdminPlayersPage } from "./AdminPlayersPage";

function visibleText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
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

  it("is display-only and does not expose player mutations", () => {
    const html = renderToStaticMarkup(<AdminPlayersPage />);

    expect(html).not.toContain("Crear Jugador");
    expect(html).not.toContain("Editar");
    expect(html).not.toContain("Eliminar");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
  });
});
