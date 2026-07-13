import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ADMIN } from "../../fixtures";
import { AdminTeamsPage } from "./AdminTeamsPage";

function visibleText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
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

  it("is display-only and does not expose team mutations", () => {
    const html = renderToStaticMarkup(<AdminTeamsPage />);

    expect(html).not.toContain("Crear Equipo");
    expect(html).not.toContain("Editar");
    expect(html).not.toContain("Eliminar");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
  });
});
