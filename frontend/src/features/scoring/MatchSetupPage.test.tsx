// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MatchSetupPage } from "./MatchSetupPage";

let search: Record<string, string> = {};
const navigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useLocation: () => ({ search }),
  useNavigate: () => navigate,
}));

describe("MatchSetupPage setup flow", () => {
  beforeEach(() => {
    search = {};
    navigate.mockReset();
  });

  function renderPage() {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    act(() => root.render(<MatchSetupPage />));
    return { container, root };
  }

  it("SSR renders the first setup step by default", () => {
    const html = renderToStaticMarkup(<MatchSetupPage />);

    expect(html).toContain("Seleccionar equipos");
    expect(html).toContain("Siguiente");
    expect(html).not.toContain("Configurar sets");
  });

  it("starts at the first setup step with forward-only navigation", () => {
    const { container, root } = renderPage();

    expect(container.textContent).toContain("Seleccionar equipos");
    expect(container.textContent).toContain("Elegí los equipos que disputan el partido.");
    expect(container.textContent).not.toContain("Configurar sets");
    expect(container.querySelector('button[aria-label="Previous step"]')).toBeNull();

    act(() => {
      [...container.querySelectorAll("button")].find((button) => button.textContent === "Siguiente")?.click();
    });

    expect(container.textContent).toContain("Configurar sets");
    expect(container.textContent).toContain("Definí la configuración de sets para este partido.");
    expect(container.textContent).not.toContain("Elegí los equipos que disputan el partido.");
    expect(container.querySelector('button[aria-label="Previous step"]')).toBeNull();

    act(() => {
      [...container.querySelectorAll("button")].find((button) => button.textContent === "Siguiente")?.click();
    });

    expect(container.textContent).toContain("Confirmar partido");
    expect(container.textContent).toContain("Revisá los datos antes de comenzar la planilla.");
    expect(container.textContent).not.toContain("Definí la configuración de sets para este partido.");
    expect(container.querySelector<HTMLButtonElement>('button[type="button"]:disabled')?.textContent).toBe("Siguiente");
    expect(container.querySelector('button[aria-label="Previous step"]')).toBeNull();

    act(() => root.unmount());
    container.remove();
  });

  it("resets to the first step when the page is mounted again", () => {
    const first = renderPage();
    act(() => {
      [...first.container.querySelectorAll("button")].find((button) => button.textContent === "Siguiente")?.click();
    });
    expect(first.container.textContent).toContain("Configurar sets");
    act(() => first.root.unmount());
    first.container.remove();

    const second = renderPage();
    expect(second.container.textContent).toContain("Seleccionar equipos");
    expect(second.container.textContent).not.toContain("Configurar sets");
    act(() => second.root.unmount());
    second.container.remove();
  });

  it("opens from the query and closes by removing only the modal query", () => {
    search = { modal: "player-selection", view: "setup" };
    const { container, root } = renderPage();

    expect(container.querySelector('[role="dialog"]')).not.toBeNull();

    act(() => {
      container.querySelector<HTMLButtonElement>('button[aria-label="Close modal"]')?.click();
    });

    expect(navigate).toHaveBeenCalledTimes(1);
    const updateSearch = navigate.mock.calls[0][0].search;
    expect(updateSearch(search)).toEqual({ view: "setup" });

    search = updateSearch(search);
    act(() => root.render(<MatchSetupPage />));
    expect(container.querySelector('[role="dialog"]')).toBeNull();

    act(() => root.unmount());
    container.remove();
  });

  it("opens the modal through navigation while preserving other query values", () => {
    const { container, root } = renderPage();
    const openButton = [...container.querySelectorAll("button")].find(
      (button) => button.textContent === "Seleccionar jugadores",
    );

    act(() => openButton?.click());

    expect(navigate).toHaveBeenCalledTimes(1);
    const updateSearch = navigate.mock.calls[0][0].search;
    expect(updateSearch({ view: "setup" })).toEqual({ view: "setup", modal: "player-selection" });

    act(() => root.unmount());
    container.remove();
  });
});
