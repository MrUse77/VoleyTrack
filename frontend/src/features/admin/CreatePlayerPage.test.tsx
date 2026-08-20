// @vitest-environment jsdom
import { act, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { CreatePlayerPage } from "./CreatePlayerPage";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, ...props }: { to: string; children?: ReactNode } & ComponentPropsWithoutRef<"a">) => (
    <a {...props} href={to} />
  ),
}));

function renderPage() {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  act(() => root.render(<CreatePlayerPage />));
  return { container, root };
}

function getControlByLabel<Control extends HTMLInputElement | HTMLSelectElement>(
  container: HTMLElement,
  labelText: string,
) {
  const label = [...container.querySelectorAll("label")].find((candidate) => candidate.textContent === labelText);
  const controlId = label?.htmlFor;

  if (!controlId) {
    throw new Error(`Missing control label: ${labelText}`);
  }

  return container.querySelector<Control>(`#${controlId}`)!;
}

function setInputValue(input: HTMLInputElement, value: string) {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

describe("CreatePlayerPage", () => {
  it("SSR renders the canonical create-player form", () => {
    const html = renderToStaticMarkup(<CreatePlayerPage />);

    expect(html).toContain("Crear Nuevo Jugador");
    expect(html).toContain("Cancelar");
    expect(html).toContain('href="/admin/players"');
    expect(html).toContain("Nombre");
    expect(html).toContain("Apellido");
    expect(html).toContain("Fecha de nacimiento");
    expect(html).toContain("Dorsal");
    expect(html).toContain("Posición");
    expect(html).toContain("Datos personales");
    expect(html).toContain("Datos deportivos");
  });

  it("marks every player field as required and shows feedback when submitted empty", () => {
    const rendered = renderPage();

    try {
      const form = rendered.container.querySelector("form")!;
      const controls = [
        getControlByLabel<HTMLInputElement>(rendered.container, "Nombre"),
        getControlByLabel<HTMLInputElement>(rendered.container, "Apellido"),
        getControlByLabel<HTMLInputElement>(rendered.container, "Fecha de nacimiento"),
        getControlByLabel<HTMLInputElement>(rendered.container, "Dorsal"),
        getControlByLabel<HTMLSelectElement>(rendered.container, "Posición"),
      ];

      expect(controls.every((control) => control.required)).toBe(true);

      act(() => form.requestSubmit());

      expect(rendered.container.querySelector('[role="alert"]')?.textContent).toContain("Revisá");
      expect(controls.every((control) => control.getAttribute("aria-invalid") === "true")).toBe(true);
      expect(rendered.container.textContent).not.toContain("Jugador preparado localmente");
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });

  it("rejects a dorsal above 99 with visible accessible feedback", () => {
    const rendered = renderPage();

    try {
      const form = rendered.container.querySelector("form")!;
      const firstName = getControlByLabel<HTMLInputElement>(rendered.container, "Nombre");
      const lastName = getControlByLabel<HTMLInputElement>(rendered.container, "Apellido");
      const birthDate = getControlByLabel<HTMLInputElement>(rendered.container, "Fecha de nacimiento");
      const number = getControlByLabel<HTMLInputElement>(rendered.container, "Dorsal");
      const position = getControlByLabel<HTMLSelectElement>(rendered.container, "Posición");

      act(() => {
        setInputValue(firstName, "Lucía");
        setInputValue(lastName, "Gómez");
        setInputValue(birthDate, "2001-04-12");
        setInputValue(number, "100");
        position.value = "opposite";
        position.dispatchEvent(new Event("change", { bubbles: true }));
      });

      act(() => form.requestSubmit());

      expect(number.max).toBe("99");
      expect(number.getAttribute("aria-invalid")).toBe("true");
      const helper = rendered.container.querySelector(`#${number.getAttribute("aria-describedby")}`);
      expect(helper?.textContent).toBe("Ingresá un dorsal entre 0 y 99.");
      expect(helper?.querySelector('[role="alert"]')?.textContent).toBe("Ingresá un dorsal entre 0 y 99.");
      expect(rendered.container.textContent).not.toContain("Jugador preparado localmente");
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });

  it("keeps typed player values locally, submits without a network request, and resets on remount", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network requests are not allowed"));

    try {
      const first = renderPage();

      try {
        const form = first.container.querySelector("form")!;
        const firstName = getControlByLabel<HTMLInputElement>(first.container, "Nombre");
        const lastName = getControlByLabel<HTMLInputElement>(first.container, "Apellido");
        const birthDate = getControlByLabel<HTMLInputElement>(first.container, "Fecha de nacimiento");
        const number = getControlByLabel<HTMLInputElement>(first.container, "Dorsal");
        const position = getControlByLabel<HTMLSelectElement>(first.container, "Posición");

        act(() => {
          setInputValue(firstName, "Lucía");
          setInputValue(lastName, "Gómez");
          setInputValue(birthDate, "2001-04-12");
          setInputValue(number, "7");
          position.value = "opposite";
          position.dispatchEvent(new Event("change", { bubbles: true }));
        });

        expect(firstName.value).toBe("Lucía");
        expect(lastName.value).toBe("Gómez");
        expect(birthDate.value).toBe("2001-04-12");
        expect(number.value).toBe("7");
        expect(position.value).toBe("opposite");

        act(() => form.requestSubmit());

        expect(fetchSpy).not.toHaveBeenCalled();
        expect(first.container.textContent).toContain("Jugador preparado localmente");
      } finally {
        act(() => first.root.unmount());
        first.container.remove();
      }
    } finally {
      fetchSpy.mockRestore();
    }

    const second = renderPage();
    try {
      expect(getControlByLabel<HTMLInputElement>(second.container, "Nombre").value).toBe("");
      expect(getControlByLabel<HTMLInputElement>(second.container, "Apellido").value).toBe("");
      expect(getControlByLabel<HTMLInputElement>(second.container, "Fecha de nacimiento").value).toBe("");
      expect(getControlByLabel<HTMLInputElement>(second.container, "Dorsal").value).toBe("");
      expect(getControlByLabel<HTMLSelectElement>(second.container, "Posición").value).toBe("");
      expect(second.container.textContent).not.toContain("Jugador preparado localmente");
    } finally {
      act(() => second.root.unmount());
      second.container.remove();
    }
  });
});
