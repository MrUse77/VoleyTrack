import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { UIStatesBoardPage } from "./UIStatesBoardPage";

describe("UI states board", () => {
  it("renders all five mock-only state panels on one page", () => {
    const html = renderToStaticMarkup(<UIStatesBoardPage />);

    expect(html).toContain("Estados de interfaz");
    expect(html).toContain("Cargando contenido");
    expect(html).toContain("No hay resultados");
    expect(html).toContain("No pudimos mostrar esta información");
    expect(html).toContain("Sin conexión");
    expect(html).toContain("Sincronización completa");
    expect(html.match(/data-testid="ui-state"/g)).toHaveLength(5);
  });
});
