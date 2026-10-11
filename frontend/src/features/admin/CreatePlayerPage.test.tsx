// @vitest-environment jsdom
import { act, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ADMIN } from "../../fixtures";
import { CreatePlayerPage } from "./CreatePlayerPage";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, ...props }: { to: string } & ComponentPropsWithoutRef<"a"> & { children?: ReactNode }) => (
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

function setSelectValue(select: HTMLSelectElement, value: string) {
  select.value = value;
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

function fillValidForm(container: HTMLElement, overrides: Partial<Record<string, string>> = {}) {
  act(() => {
    setInputValue(getControlByLabel<HTMLInputElement>(container, "Nombre"), overrides.Nombre ?? "Lucía");
    setInputValue(getControlByLabel<HTMLInputElement>(container, "Apellido"), overrides.Apellido ?? "Gómez");
    setInputValue(getControlByLabel<HTMLInputElement>(container, "Fecha de nacimiento"), overrides["Fecha de nacimiento"] ?? "2001-04-12");
    setInputValue(getControlByLabel<HTMLInputElement>(container, "Dorsal"), overrides.Dorsal ?? "9");
    setSelectValue(getControlByLabel<HTMLSelectElement>(container, "Posición"), overrides.Posición ?? "Opuesto");
    setSelectValue(getControlByLabel<HTMLSelectElement>(container, "Equipo"), overrides.Equipo ?? ADMIN.teams[1].name);
  });
}

describe("CreatePlayerPage", () => {
  it("SSR renders the design's form card and its six fields", () => {
    const html = renderToStaticMarkup(<CreatePlayerPage />);

    expect(html).toContain("Crear jugador");
    expect(html).toContain("Datos del jugador");
    expect(html).toContain("Estado automático: Activo");
    expect(html).toContain("Cancelar");
    expect(html).toContain('href="/admin/players"');
    expect(html).toContain("Nombre");
    expect(html).toContain("Apellido");
    expect(html).toContain("Fecha de nacimiento");
    expect(html).toContain("Posición");
    expect(html).toContain("Equipo");
    expect(html).toContain("Dorsal");
    // The design has one two-column grid, not the app's former personal/sporting fieldsets.
    expect(html).not.toContain("Datos personales");
    expect(html).not.toContain("Datos deportivos");
    for (const team of ADMIN.teams) expect(html).toContain(team.name);
  });

  it("marks every field as required and reports each one when submitted empty", () => {
    const rendered = renderPage();

    try {
      const form = rendered.container.querySelector("form")!;
      const controls = [
        getControlByLabel<HTMLInputElement>(rendered.container, "Nombre"),
        getControlByLabel<HTMLInputElement>(rendered.container, "Apellido"),
        getControlByLabel<HTMLInputElement>(rendered.container, "Fecha de nacimiento"),
        getControlByLabel<HTMLInputElement>(rendered.container, "Dorsal"),
        getControlByLabel<HTMLSelectElement>(rendered.container, "Posición"),
        getControlByLabel<HTMLSelectElement>(rendered.container, "Equipo"),
      ];

      expect(controls.every((control) => control.required)).toBe(true);

      act(() => form.requestSubmit());

      expect(controls.every((control) => control.getAttribute("aria-invalid") === "true")).toBe(true);
      expect(document.activeElement).toBe(controls[0]);
      expect(rendered.container.textContent).not.toContain("Jugador preparado localmente");
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });

  it("rejects a dorsal above 99 and a dorsal already taken inside the chosen team", () => {
    const rendered = renderPage();

    try {
      const form = rendered.container.querySelector("form")!;
      const number = getControlByLabel<HTMLInputElement>(rendered.container, "Dorsal");
      const team = getControlByLabel<HTMLSelectElement>(rendered.container, "Equipo");

      fillValidForm(rendered.container, { Dorsal: "100" });
      act(() => form.requestSubmit());

      expect(number.max).toBe("99");
      expect(number.getAttribute("aria-invalid")).toBe("true");
      expect(rendered.container.querySelector(`#${number.getAttribute("aria-describedby")}`)?.textContent).toBe(
        "Ingresá un dorsal entre 1 y 99.",
      );

      // The design's hint: "El dorsal debe ser único dentro del equipo seleccionado."
      const takenPlayer = ADMIN.players[0];
      act(() => {
        setSelectValue(team, takenPlayer.teamName);
        setInputValue(number, String(takenPlayer.number));
      });
      act(() => form.requestSubmit());

      expect(number.getAttribute("aria-invalid")).toBe("true");
      expect(rendered.container.querySelector(`#${number.getAttribute("aria-describedby")}`)?.textContent).toBe(
        "Dorsal duplicado, ingresar otro valor",
      );
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
        fillValidForm(first.container);

        expect(getControlByLabel<HTMLInputElement>(first.container, "Nombre").value).toBe("Lucía");
        expect(getControlByLabel<HTMLInputElement>(first.container, "Dorsal").value).toBe("9");
        expect(getControlByLabel<HTMLSelectElement>(first.container, "Posición").value).toBe("Opuesto");

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
      expect(getControlByLabel<HTMLSelectElement>(second.container, "Equipo").value).toBe("");
      expect(second.container.textContent).not.toContain("Jugador preparado localmente");
    } finally {
      act(() => second.root.unmount());
      second.container.remove();
    }
  });
});
