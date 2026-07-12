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

    expect(html).toContain("Crear jugador");
    expect(html).toContain("Cancelar");
    expect(html).toContain('href="/admin/players"');
    expect(html).toContain("Nombre completo");
    expect(html).toContain("Número");
    expect(html).toContain("Posición");
  });

  it("keeps typed player values locally, submits without a network request, and resets on remount", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network requests are not allowed"));

    try {
      const first = renderPage();

      try {
        const form = first.container.querySelector("form")!;
        const name = getControlByLabel<HTMLInputElement>(first.container, "Nombre completo");
        const number = getControlByLabel<HTMLInputElement>(first.container, "Número");
        const position = getControlByLabel<HTMLSelectElement>(first.container, "Posición");

        act(() => {
          setInputValue(name, "Lucía Gómez");
          setInputValue(number, "7");
          position.value = "opposite";
          position.dispatchEvent(new Event("change", { bubbles: true }));
        });

        expect(name.value).toBe("Lucía Gómez");
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
      expect(getControlByLabel<HTMLInputElement>(second.container, "Nombre completo").value).toBe("");
      expect(getControlByLabel<HTMLInputElement>(second.container, "Número").value).toBe("");
      expect(getControlByLabel<HTMLSelectElement>(second.container, "Posición").value).toBe("setter");
      expect(second.container.textContent).not.toContain("Jugador preparado localmente");
    } finally {
      act(() => second.root.unmount());
      second.container.remove();
    }
  });
});
