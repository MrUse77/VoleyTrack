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

    expect(html).toContain("Registrar planillero");
    expect(html).toContain("Nombre completo");
    expect(html).toContain("Correo electrónico");
    expect(html).toContain("Rol");
  });

  it("keeps typed identity and role values locally, submits without a network request, and resets on remount", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network requests are not allowed"));

    try {
      const first = renderPage();

      try {
        const form = first.container.querySelector("form")!;
        const name = getControlByLabel<HTMLInputElement>(first.container, "Nombre completo");
        const email = getControlByLabel<HTMLInputElement>(first.container, "Correo electrónico");
        const role = getControlByLabel<HTMLSelectElement>(first.container, "Rol");

        act(() => {
          setInputValue(name, "Lucía Gómez");
          setInputValue(email, "lucia.gomez@example.test");
          role.value = "assistant";
          role.dispatchEvent(new Event("change", { bubbles: true }));
        });

        expect(name.value).toBe("Lucía Gómez");
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
      expect(getControlByLabel<HTMLInputElement>(second.container, "Nombre completo").value).toBe("");
      expect(getControlByLabel<HTMLInputElement>(second.container, "Correo electrónico").value).toBe("");
      expect(getControlByLabel<HTMLSelectElement>(second.container, "Rol").value).toBe("scorer");
      expect(second.container.textContent).not.toContain("Registro preparado localmente");
    } finally {
      act(() => second.root.unmount());
      second.container.remove();
    }
  });
});
