// @vitest-environment jsdom
import { act, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { CreateTeamPage } from "./CreateTeamPage";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, ...props }: { to: string; children?: ReactNode } & ComponentPropsWithoutRef<"a">) => (
    <a {...props} href={to} />
  ),
}));

function renderPage() {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  act(() => root.render(<CreateTeamPage />));
  return { container, root };
}

function getInputByLabel(container: HTMLElement, labelText: string) {
  const label = [...container.querySelectorAll("label")].find((candidate) => candidate.textContent === labelText);
  const inputId = label?.htmlFor;

  if (!inputId) {
    throw new Error(`Missing input label: ${labelText}`);
  }

  return container.querySelector<HTMLInputElement>(`#${inputId}`)!;
}

function setInputValue(input: HTMLInputElement, value: string) {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

describe("CreateTeamPage", () => {
  it("SSR renders the canonical create-team desktop form", () => {
    const html = renderToStaticMarkup(<CreateTeamPage />);

    expect(html).toContain("Crear Nuevo Equipo");
    expect(html).toContain("Da de alta un club y conforma su plantel.");
    expect(html).toContain("Nombre del Club");
    expect(html).toContain("Ej: Club Atlético River Plate");
    expect(html).toContain("Entrenador (Coach)");
    expect(html).toContain("Nombre del director técnico");
    expect(html).toContain("Aún no hay jugadores. Haz clic en &quot;Agregar Jugador&quot;.");
    expect(html).toContain("+ Agregar Jugador");
    expect(html).toContain("Registrar Equipo");
    expect(html).toContain("Cancelar");
  });

  it("links Cancelar to the teams administration page", () => {
    const page = renderPage();
    try {
      const cancel = [...page.container.querySelectorAll("a")].find((link) => link.textContent === "Cancelar");
      expect(cancel?.getAttribute("href")).toBe("/admin/teams");
    } finally {
      act(() => page.root.unmount());
      page.container.remove();
    }
  });

  it("keeps typed team values locally and prevents submit without a network request", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network requests are not allowed"));
    const page = renderPage();

    try {
      const form = page.container.querySelector("form")!;
      const clubName = getInputByLabel(page.container, "Nombre del Club");
      const coach = getInputByLabel(page.container, "Entrenador (Coach)");

      act(() => {
        setInputValue(clubName, "Club Atlético River Plate");
        setInputValue(coach, "Marcelo Gallardo");
      });

      expect(clubName.value).toBe("Club Atlético River Plate");
      expect(coach.value).toBe("Marcelo Gallardo");

      act(() => form.requestSubmit());

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(page.container.textContent).toContain("Crear Nuevo Equipo");
    } finally {
      act(() => page.root.unmount());
      page.container.remove();
      fetchSpy.mockRestore();
    }
  });

  it("defers adding a player without opening a modal, navigating, or submitting", () => {
    const page = renderPage();
    const form = page.container.querySelector("form")!;
    const addPlayer = [...page.container.querySelectorAll("button")].find((button) => button.textContent === "+ Agregar Jugador");
    const submitSpy = vi.fn();
    const location = window.location.href;
    form.addEventListener("submit", submitSpy);

    try {
      if (!addPlayer) throw new Error("Missing add-player button");
      act(() => addPlayer.click());

      expect(page.container.querySelector('[role="dialog"], dialog, [aria-modal="true"]')).toBeNull();
      expect(page.container.querySelector('select, input[type="checkbox"], input[type="radio"]')).toBeNull();
      expect(window.location.href).toBe(location);
      expect(submitSpy).not.toHaveBeenCalled();
    } finally {
      act(() => page.root.unmount());
      page.container.remove();
    }
  });
});
