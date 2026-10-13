// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { StaffRegisterPage } from "./StaffRegisterPage";

function renderPage() {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  act(() => root.render(<StaffRegisterPage />));
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

  // This test environment has no accessibility query helper; keep this lookup scoped to the rendered form.
  return container.querySelector<Control>(`#${controlId}`)!;
}

function setInputValue(input: HTMLInputElement, value: string) {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

describe("StaffRegisterPage", () => {
  it("SSR renders the canonical staff registration form", () => {
    const html = renderToStaticMarkup(<StaffRegisterPage />);

    expect(html).toContain("Registrar Nuevo Planillero");
    expect(html).toContain("Nombre");
    expect(html).toContain("Apellido");
    expect(html).toContain("DNI");
    expect(html).toContain("Teléfono");
    expect(html).toContain("Email");
    expect(html).toContain("Rol");
  });

  it("marks every required field and shows inline feedback when submitted empty", () => {
    const rendered = renderPage();

    try {
      const form = rendered.container.querySelector("form")!;
      const controls = [
        getControlByLabel<HTMLInputElement>(rendered.container, "Nombre"),
        getControlByLabel<HTMLInputElement>(rendered.container, "Apellido"),
        getControlByLabel<HTMLInputElement>(rendered.container, "DNI"),
        getControlByLabel<HTMLInputElement>(rendered.container, "Teléfono"),
        getControlByLabel<HTMLInputElement>(rendered.container, "Email"),
      ];

      expect(controls.every((control) => control.required)).toBe(true);

      act(() => form.requestSubmit());

      expect(rendered.container.querySelector('[role="alert"]')?.textContent).toContain("Revisá");
      expect(controls.every((control) => control.getAttribute("aria-invalid") === "true")).toBe(true);
      expect(rendered.container.textContent).not.toContain("Registro preparado localmente");
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });

  it("keeps typed values locally, submits without a network request, and resets on remount", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network requests are not allowed"));

    try {
      const first = renderPage();

      try {
        const form = first.container.querySelector("form")!;
        const firstName = getControlByLabel<HTMLInputElement>(first.container, "Nombre");
        const lastName = getControlByLabel<HTMLInputElement>(first.container, "Apellido");
        const dni = getControlByLabel<HTMLInputElement>(first.container, "DNI");
        const phone = getControlByLabel<HTMLInputElement>(first.container, "Teléfono");
        const email = getControlByLabel<HTMLInputElement>(first.container, "Email");
        const role = getControlByLabel<HTMLSelectElement>(first.container, "Rol");

        act(() => {
          setInputValue(firstName, "Lucía");
          setInputValue(lastName, "Gómez");
          setInputValue(dni, "32123456");
          setInputValue(phone, "1123456789");
          setInputValue(email, "lucia.gomez@example.test");
          role.value = "assistant";
          role.dispatchEvent(new Event("change", { bubbles: true }));
        });

        expect(firstName.value).toBe("Lucía");
        expect(lastName.value).toBe("Gómez");
        expect(dni.value).toBe("32123456");
        expect(phone.value).toBe("1123456789");
        expect(email.value).toBe("lucia.gomez@example.test");
        expect(role.value).toBe("assistant");

        act(() => form.requestSubmit());

        expect(fetchSpy).not.toHaveBeenCalled();
        expect(first.container.textContent).toContain("Registro preparado localmente");
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
      expect(getControlByLabel<HTMLInputElement>(second.container, "DNI").value).toBe("");
      expect(getControlByLabel<HTMLInputElement>(second.container, "Teléfono").value).toBe("");
      expect(getControlByLabel<HTMLInputElement>(second.container, "Email").value).toBe("");
      expect(getControlByLabel<HTMLSelectElement>(second.container, "Rol").value).toBe("scorer");
      expect(second.container.textContent).not.toContain("Registro preparado localmente");
    } finally {
      act(() => second.root.unmount());
      second.container.remove();
    }
  });
});
