// @vitest-environment jsdom
import { act, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ADMIN } from "../../fixtures";
import { CreateMatchPage } from "./CreateMatchPage";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, ...props }: { to: string; children?: ReactNode } & ComponentPropsWithoutRef<"a">) => (
    <a {...props} href={to} />
  ),
}));

function renderPage() {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  act(() => root.render(<CreateMatchPage />));
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

function setSelectValue(select: HTMLSelectElement, value: string) {
  select.value = value;
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

describe("CreateMatchPage", () => {
  it("SSR renders the design's form card and its fields", () => {
    const html = renderToStaticMarkup(<CreateMatchPage />);

    expect(html).toContain("Crear partido");
    expect(html).toContain("Programá un encuentro entre dos equipos activos.");
    expect(html).toContain("Datos del partido");
    expect(html).toContain("Estado automático: Programado");
    expect(html).toContain("Torneo");
    expect(html).toContain("Equipo local");
    expect(html).toContain("Equipo visitante");
    expect(html).toContain("Fecha");
    expect(html).toContain("Horario disponible");
    expect(html).toContain("Cancelar");
    expect(html).toContain('href="/admin/matches"');
    for (const tournament of ADMIN.tournaments) expect(html).toContain(tournament.name);
    for (const team of ADMIN.teams) expect(html).toContain(team.name);
  });

  it("keeps the design's unlock order for teams, date and slot", () => {
    const rendered = renderPage();

    try {
      const container = rendered.container;
      const tournament = getControlByLabel<HTMLSelectElement>(container, "Torneo");
      const homeTeam = getControlByLabel<HTMLSelectElement>(container, "Equipo local");
      const awayTeam = getControlByLabel<HTMLSelectElement>(container, "Equipo visitante");
      const date = getControlByLabel<HTMLInputElement>(container, "Fecha");
      const time = getControlByLabel<HTMLSelectElement>(container, "Horario disponible");

      expect(homeTeam.disabled).toBe(true);
      expect(awayTeam.disabled).toBe(true);
      expect(date.disabled).toBe(true);
      expect(time.disabled).toBe(true);
      expect(container.textContent).toContain("Seleccioná dos equipos diferentes para habilitar la fecha.");
      expect(container.textContent).toContain("Seleccioná una fecha para consultar la disponibilidad.");

      act(() => setSelectValue(tournament, ADMIN.tournaments[0].id));
      expect(homeTeam.disabled).toBe(false);
      expect(awayTeam.disabled).toBe(false);

      // The same team on both sides never unlocks the schedule.
      act(() => setSelectValue(homeTeam, ADMIN.teams[0].id));
      act(() => setSelectValue(awayTeam, ADMIN.teams[0].id));
      expect(date.disabled).toBe(true);

      act(() => setSelectValue(awayTeam, ADMIN.teams[1].id));
      expect(date.disabled).toBe(false);
      expect(container.textContent).toContain("Local");
      expect(container.textContent).toContain("Visitante");

      act(() => setInputValue(date, "2999-12-31"));
      expect(time.disabled).toBe(false);
      expect(container.textContent).toContain("Solo se muestran horarios disponibles.");
      expect(container.textContent).toContain("18:00");
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });

  it("reports the required fields and the same-team rule when submitted", () => {
    const rendered = renderPage();

    try {
      const container = rendered.container;
      const form = container.querySelector("form")!;

      act(() => form.requestSubmit());

      const tournament = getControlByLabel<HTMLSelectElement>(container, "Torneo");
      expect(tournament.getAttribute("aria-invalid")).toBe("true");
      expect(container.textContent).toContain("Seleccioná un torneo.");
      expect(container.textContent).not.toContain("Partido preparado localmente");

      act(() => setSelectValue(tournament, ADMIN.tournaments[0].id));
      act(() => setSelectValue(getControlByLabel<HTMLSelectElement>(container, "Equipo local"), ADMIN.teams[0].id));
      act(() => setSelectValue(getControlByLabel<HTMLSelectElement>(container, "Equipo visitante"), ADMIN.teams[0].id));
      act(() => form.requestSubmit());

      expect(container.textContent).toContain("Un equipo no puede jugar contra sí mismo");
      expect(container.textContent).not.toContain("Partido preparado localmente");
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });

  it("keeps match details locally, submits without navigation or network, and resets on remount", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network requests are not allowed"));
    const first = renderPage();

    try {
      const container = first.container;
      const form = container.querySelector("form")!;
      const location = window.location.href;

      act(() => setSelectValue(getControlByLabel<HTMLSelectElement>(container, "Torneo"), ADMIN.tournaments[0].id));
      act(() => setSelectValue(getControlByLabel<HTMLSelectElement>(container, "Equipo local"), ADMIN.teams[0].id));
      act(() => setSelectValue(getControlByLabel<HTMLSelectElement>(container, "Equipo visitante"), ADMIN.teams[1].id));
      act(() => setInputValue(getControlByLabel<HTMLInputElement>(container, "Fecha"), "2999-12-31"));
      act(() => setSelectValue(getControlByLabel<HTMLSelectElement>(container, "Horario disponible"), "19:30"));

      act(() => form.requestSubmit());

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(window.location.href).toBe(location);
      expect(container.textContent).toContain("Partido preparado localmente");
    } finally {
      act(() => first.root.unmount());
      first.container.remove();
      fetchSpy.mockRestore();
    }

    const second = renderPage();
    try {
      expect(getControlByLabel<HTMLSelectElement>(second.container, "Torneo").value).toBe("");
      expect(getControlByLabel<HTMLSelectElement>(second.container, "Equipo local").value).toBe("");
      expect(getControlByLabel<HTMLSelectElement>(second.container, "Equipo visitante").value).toBe("");
      expect(getControlByLabel<HTMLInputElement>(second.container, "Fecha").value).toBe("");
      expect(getControlByLabel<HTMLSelectElement>(second.container, "Horario disponible").value).toBe("");
      expect(second.container.textContent).not.toContain("Partido preparado localmente");
    } finally {
      act(() => second.root.unmount());
      second.container.remove();
    }
  });
});
