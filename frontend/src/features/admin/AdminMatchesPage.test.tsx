import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ADMIN } from "../../fixtures";
import { AdminMatchesPage } from "./AdminMatchesPage";

function visibleText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
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

  it("is display-only and does not expose match mutations", () => {
    const html = renderToStaticMarkup(<AdminMatchesPage />);

    expect(html).not.toContain("Crear Partido");
    expect(html).not.toContain("Editar");
    expect(html).not.toContain("Eliminar");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
  });
});
