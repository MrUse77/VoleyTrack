// @vitest-environment jsdom
import { act, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { CreateTournamentPage } from "./CreateTournamentPage";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, ...props }: { to: string; children?: ReactNode } & ComponentPropsWithoutRef<"a">) => (
    <a {...props} href={to} />
  ),
}));

function renderPage() {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  act(() => root.render(<CreateTournamentPage />));
  return { container, root };
}

function getControlByLabel<Control extends HTMLInputElement | HTMLSelectElement>(
  container: HTMLElement,
  labelText: string,
) {
  const label = [...container.querySelectorAll("label")].find((candidate) => candidate.textContent === labelText);
  const controlId = label?.htmlFor;

  if (!controlId) throw new Error(`Missing control label: ${labelText}`);
  return container.querySelector<Control>(`#${controlId}`)!;
}

function setInputValue(input: HTMLInputElement, value: string) {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

describe("CreateTournamentPage", () => {
  it("SSR renders the canonical create-tournament desktop form", () => {
    const html = renderToStaticMarkup(<CreateTournamentPage />);

    expect(html).toContain("Crear Torneo");
    expect(html).toContain("Configura los parámetros iniciales de la competencia.");
    expect(html).toContain("Nombre del Torneo");
    expect(html).toContain("Ej: Liga Nacional 2026");
    expect(html).toContain("Fecha de Inicio");
    expect(html).toContain("Fecha de Fin");
    expect(html).toContain("Tipo de Competición");
    expect(html).toContain("Seleccionar (Liga Regular, Playoffs...)");
    expect(html).toContain("Crear Torneo");
    expect(html).toContain("Cancelar");
  });

  it("keeps typed values locally, submits without navigation or network, and resets on remount", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network requests are not allowed"));
    const first = renderPage();

    try {
      const form = first.container.querySelector("form")!;
      const name = getControlByLabel<HTMLInputElement>(first.container, "Nombre del Torneo");
      const format = getControlByLabel<HTMLSelectElement>(first.container, "Tipo de Competición");
      const startDate = getControlByLabel<HTMLInputElement>(first.container, "Fecha de Inicio");
      const endDate = getControlByLabel<HTMLInputElement>(first.container, "Fecha de Fin");
      const location = window.location.href;

      expect(first.container.querySelector('a[href="/admin/tournaments"]')).not.toBeNull();

      act(() => {
        setInputValue(name, "Liga Nacional 2026");
        format.value = "regular-league";
        format.dispatchEvent(new Event("change", { bubbles: true }));
        setInputValue(startDate, "2026-04-01");
        setInputValue(endDate, "2026-08-30");
      });

      expect(name.value).toBe("Liga Nacional 2026");
      expect(format.value).toBe("regular-league");
      expect(startDate.value).toBe("2026-04-01");
      expect(endDate.value).toBe("2026-08-30");

      act(() => form.requestSubmit());

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(window.location.href).toBe(location);
      expect(first.container.textContent).toContain("Torneo preparado localmente");

      act(() => setInputValue(name, "Liga Nacional 2027"));
      expect(first.container.textContent).not.toContain("Torneo preparado localmente");
    } finally {
      act(() => first.root.unmount());
      first.container.remove();
      fetchSpy.mockRestore();
    }

    const second = renderPage();
    try {
      expect(getControlByLabel<HTMLInputElement>(second.container, "Nombre del Torneo").value).toBe("");
      expect(getControlByLabel<HTMLSelectElement>(second.container, "Tipo de Competición").value).toBe("");
      expect(getControlByLabel<HTMLInputElement>(second.container, "Fecha de Inicio").value).toBe("");
      expect(getControlByLabel<HTMLInputElement>(second.container, "Fecha de Fin").value).toBe("");
      expect(second.container.textContent).not.toContain("Torneo preparado localmente");
    } finally {
      act(() => second.root.unmount());
      second.container.remove();
    }
  });
});
