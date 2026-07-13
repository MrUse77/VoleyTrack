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

describe("CreateMatchPage", () => {
  it("SSR renders the canonical create-match form", () => {
    const html = renderToStaticMarkup(<CreateMatchPage />);

    expect(html).toContain("Crear Partido");
    expect(html).toContain("Programa un encuentro para el torneo seleccionado.");
    expect(html).toContain("Torneo");
    expect(html).toContain("Equipo Local");
    expect(html).toContain("Equipo Visitante");
    expect(html).toContain("Fecha y Hora");
    expect(html).toContain("Sede");
    expect(html).toContain("Ej: Polideportivo Municipal");
    expect(html).toContain("Cancelar");
    for (const tournament of ADMIN.tournaments) expect(html).toContain(tournament.name);
    for (const team of ADMIN.teams) expect(html).toContain(team.name);
  });

  it("does not show success when the empty form is submitted", () => {
    const page = renderPage();

    try {
      const form = page.container.querySelector("form")!;

      act(() => {
        form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
      });

      expect(page.container.textContent).not.toContain("Partido preparado localmente");
    } finally {
      act(() => page.root.unmount());
      page.container.remove();
    }
  });

  it("keeps match details locally, submits without navigation or network, and resets on remount", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network requests are not allowed"));
    const first = renderPage();

    try {
      const form = first.container.querySelector("form")!;
      const tournament = getControlByLabel<HTMLSelectElement>(first.container, "Torneo");
      const homeTeam = getControlByLabel<HTMLSelectElement>(first.container, "Equipo Local");
      const awayTeam = getControlByLabel<HTMLSelectElement>(first.container, "Equipo Visitante");
      const scheduledAt = getControlByLabel<HTMLInputElement>(first.container, "Fecha y Hora");
      const venue = getControlByLabel<HTMLInputElement>(first.container, "Sede");
      const location = window.location.href;

      expect(first.container.querySelector('a[href="/admin/matches"]')).not.toBeNull();

      act(() => {
        tournament.value = ADMIN.tournaments[0].id;
        tournament.dispatchEvent(new Event("change", { bubbles: true }));
        homeTeam.value = ADMIN.teams[0].id;
        homeTeam.dispatchEvent(new Event("change", { bubbles: true }));
        awayTeam.value = ADMIN.teams[1].id;
        awayTeam.dispatchEvent(new Event("change", { bubbles: true }));
        setInputValue(scheduledAt, "2026-05-15T20:30");
        setInputValue(venue, "Polideportivo Municipal");
      });

      expect(tournament.value).toBe(ADMIN.tournaments[0].id);
      expect(homeTeam.value).toBe(ADMIN.teams[0].id);
      expect(awayTeam.value).toBe(ADMIN.teams[1].id);
      expect(scheduledAt.value).toBe("2026-05-15T20:30");
      expect(venue.value).toBe("Polideportivo Municipal");

      act(() => form.requestSubmit());

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(window.location.href).toBe(location);
      expect(first.container.textContent).toContain("Partido preparado localmente");

      act(() => setInputValue(venue, "Estadio Central"));
      expect(first.container.textContent).not.toContain("Partido preparado localmente");
    } finally {
      act(() => first.root.unmount());
      first.container.remove();
      fetchSpy.mockRestore();
    }

    const second = renderPage();
    try {
      expect(getControlByLabel<HTMLSelectElement>(second.container, "Torneo").value).toBe("");
      expect(getControlByLabel<HTMLSelectElement>(second.container, "Equipo Local").value).toBe("");
      expect(getControlByLabel<HTMLSelectElement>(second.container, "Equipo Visitante").value).toBe("");
      expect(getControlByLabel<HTMLInputElement>(second.container, "Fecha y Hora").value).toBe("");
      expect(getControlByLabel<HTMLInputElement>(second.container, "Sede").value).toBe("");
      expect(second.container.textContent).not.toContain("Partido preparado localmente");
    } finally {
      act(() => second.root.unmount());
      second.container.remove();
    }
  });
});
