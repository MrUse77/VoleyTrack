// @vitest-environment jsdom
import { act, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { CreateTournamentPage } from "./CreateTournamentPage";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ activeOptions: _exactMarking, to, ...props }: { activeOptions?: unknown; to: string; children?: ReactNode } & ComponentPropsWithoutRef<"a">) => {
    // `activeOptions` is the exactness option the app's own Link
    // (components/navigation/NavigationLink) always passes; a plain anchor has no such
    // attribute, so the option is consumed here instead of leaking into the markup.
    void _exactMarking;

    return <a {...props} href={to} />;
  },
}));

function renderPage() {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  act(() => root.render(<CreateTournamentPage />));
  return { container, root };
}

function getControlByLabel<Control extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
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
  it("SSR renders the design's create-tournament form", () => {
    const html = renderToStaticMarkup(<CreateTournamentPage />);

    expect(html).toContain("Nuevo torneo");
    expect(html).toContain("Crear un torneo nuevo y configurar su sistema de competencia.");
    expect(html).toContain("Datos del torneo");
    expect(html).toContain("NUEVO");
    expect(html).toContain("Nombre del torneo");
    expect(html).toContain("Ej: Liga Argentina A1");
    expect(html).toContain("Temporada");
    expect(html).toContain("Sistema de competencia");
    expect(html).toContain("Cantidad de equipos");
    expect(html).toContain("Fecha de inicio");
    expect(html).toContain("Fecha de finalización");
    expect(html).toContain("Descripción");
    expect(html).toContain("Crear torneo");
    expect(html).toContain("Cancelar");
    expect(html).toContain("Volver");
  });

  it("keeps typed values locally, submits without navigation or network, and resets on remount", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network requests are not allowed"));
    const first = renderPage();

    try {
      const form = first.container.querySelector("form")!;
      const name = getControlByLabel<HTMLInputElement>(first.container, "Nombre del torneo");
      const system = getControlByLabel<HTMLSelectElement>(first.container, "Sistema de competencia");
      const startDate = getControlByLabel<HTMLInputElement>(first.container, "Fecha de inicio");
      const endDate = getControlByLabel<HTMLInputElement>(first.container, "Fecha de finalización");
      const location = window.location.href;

      expect(first.container.querySelector('a[href="/admin/tournaments"]')).not.toBeNull();

      act(() => {
        setInputValue(name, "Liga Nacional 2026");
        system.value = "Liga regular";
        system.dispatchEvent(new Event("change", { bubbles: true }));
        setInputValue(startDate, "2026-04-01");
        setInputValue(endDate, "2026-08-30");
      });

      expect(name.value).toBe("Liga Nacional 2026");
      expect(system.value).toBe("Liga regular");
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
      expect(getControlByLabel<HTMLInputElement>(second.container, "Nombre del torneo").value).toBe("");
      expect(getControlByLabel<HTMLSelectElement>(second.container, "Sistema de competencia").value).toBe("");
      expect(getControlByLabel<HTMLInputElement>(second.container, "Fecha de inicio").value).toBe("");
      expect(getControlByLabel<HTMLInputElement>(second.container, "Fecha de finalización").value).toBe("");
      expect(second.container.textContent).not.toContain("Torneo preparado localmente");
    } finally {
      act(() => second.root.unmount());
      second.container.remove();
    }
  });
});
