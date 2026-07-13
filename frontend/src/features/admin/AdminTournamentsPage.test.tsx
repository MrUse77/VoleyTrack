import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ADMIN } from "../../fixtures";
import { AdminTournamentsPage } from "./AdminTournamentsPage";

function visibleText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
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

  it("is display-only and does not expose tournament mutations", () => {
    const html = renderToStaticMarkup(<AdminTournamentsPage />);

    expect(html).not.toContain("Crear Torneo");
    expect(html).not.toContain("Editar");
    expect(html).not.toContain("Eliminar");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
  });
});
