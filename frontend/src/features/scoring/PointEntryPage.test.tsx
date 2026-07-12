// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PointEntryPage } from "./PointEntryPage";

let search: Record<string, string> = {};

vi.mock("@tanstack/react-router", () => ({
  useLocation: () => ({ search }),
}));

describe("PointEntryPage", () => {
  beforeEach(() => {
    search = {};
  });

  function renderPage() {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    act(() => root.render(<PointEntryPage />));
    return { container, root };
  }

  it("SSR renders the first canonical step by default", () => {
    const html = renderToStaticMarkup(<PointEntryPage />);

    expect(html).toContain("Seleccionar equipo que anota");
    expect(html).toContain('aria-label="Siguiente paso"');
    expect(html).toContain("Siguiente");
    expect(html).not.toContain("Registrar acción");
  });

  it("initializes from a valid canonical step query and resets invalid queries to the first step", () => {
    search = { step: "point-step-action" };
    expect(renderToStaticMarkup(<PointEntryPage />)).toContain("Registrar acción");

    search = { step: "not-a-step" };
    expect(renderToStaticMarkup(<PointEntryPage />)).toContain("Seleccionar equipo que anota");
  });

  it("advances only forward and disables Siguiente on the terminal step", () => {
    const { container, root } = renderPage();
    const nextButton = () =>
      [...container.getElementsByTagName("button")].find((button) => button.getAttribute("aria-label") === "Siguiente paso");

    expect(nextButton()).toBeDefined();
    act(() => nextButton()?.click());

    expect(container.textContent).toContain("Registrar acción");
    expect(nextButton()?.disabled).toBe(true);

    act(() => root.unmount());
    container.remove();
  });

  it("resets to the first step after remounting without a valid step query", () => {
    const first = renderPage();
    act(() =>
      [...first.container.getElementsByTagName("button")]
        .find((button) => button.getAttribute("aria-label") === "Siguiente paso")
        ?.click(),
    );
    expect(first.container.textContent).toContain("Registrar acción");
    act(() => first.root.unmount());
    first.container.remove();

    search = {};
    const second = renderPage();
    expect(second.container.textContent).toContain("Seleccionar equipo que anota");
    act(() => second.root.unmount());
    second.container.remove();
  });
});
