// @vitest-environment jsdom
import { act, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ADMIN } from "../../fixtures";
import { CreateTeamPage } from "./CreateTeamPage";

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
  act(() => root.render(<CreateTeamPage />));
  return { container, root };
}

function controlByLabel(container: HTMLElement, labelText: string): HTMLElement {
  const label = [...container.querySelectorAll("label")].find((candidate) => candidate.textContent === labelText);
  const controlId = label?.htmlFor;

  if (!controlId) {
    throw new Error(`Missing control label: ${labelText}`);
  }

  return container.querySelector<HTMLElement>(`#${controlId}`)!;
}

function getInputByLabel(container: HTMLElement, labelText: string): HTMLInputElement {
  return controlByLabel(container, labelText) as HTMLInputElement;
}

function getSelectByLabel(container: HTMLElement, labelText: string): HTMLSelectElement {
  return controlByLabel(container, labelText) as HTMLSelectElement;
}

function setInputValue(input: HTMLInputElement, value: string) {
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

function setSelectValue(select: HTMLSelectElement, value: string) {
  Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value")?.set?.call(select, value);
  select.dispatchEvent(new Event("change", { bubbles: true }));
}

function submitClubForm(container: HTMLElement) {
  act(() => container.querySelector("form")!.requestSubmit());
}

describe("CreateTeamPage", () => {
  it("SSR renders the design's two cards and its form actions", () => {
    const html = renderToStaticMarkup(<CreateTeamPage />);

    expect(html).toContain("Crear equipo");
    expect(html).toContain("Registrá un club con su entrenador y su plantel de jugadores.");
    expect(html).toContain("Datos del club");
    expect(html).toContain("OBLIGATORIO");
    expect(html).toContain("Nombre del club");
    expect(html).toContain("Entrenador");
    expect(html).toContain("Plantel");
    expect(html).toContain("JUGADORES");
    expect(html).toContain("Todavía no cargaste jugadores");
    expect(html).toContain("Agregar jugador");
    expect(html).toContain("Cancelar");
    expect(html).toContain("Crear");
    // The design's `.file-field` needs an upload path the app does not have, so the region is
    // not rendered rather than shipped as a control that does nothing.
    expect(html).not.toContain("Escudo");
    expect(html).not.toContain('type="file"');
  });

  it("links Volver and Cancelar to the teams administration page", () => {
    const page = renderPage();

    try {
      const links = [...page.container.querySelectorAll("a")];
      expect(links.find((link) => link.textContent?.includes("Volver"))?.getAttribute("href")).toBe("/admin/teams");
      expect(links.find((link) => link.textContent === "Cancelar")?.getAttribute("href")).toBe("/admin/teams");
    } finally {
      act(() => page.root.unmount());
      page.container.remove();
    }
  });

  it("keeps typed club values locally and validates them without a network request", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network requests are not allowed"));
    const page = renderPage();

    try {
      const clubName = getInputByLabel(page.container, "Nombre del club");
      const coach = getInputByLabel(page.container, "Entrenador");

      act(() => {
        setInputValue(clubName, "Nuevo Club Vóley");
        setInputValue(coach, "Marcelo Gallardo");
      });

      expect(clubName.value).toBe("Nuevo Club Vóley");
      expect(coach.value).toBe("Marcelo Gallardo");

      // FA-01: incomplete data.
      act(() => {
        setInputValue(clubName, "");
        setInputValue(coach, "");
      });
      submitClubForm(page.container);
      expect(page.container.textContent).toContain("Completá el nombre del club y el entrenador.");

      // FA-02: duplicate name.
      act(() => {
        setInputValue(clubName, ADMIN.teams[0].name);
        setInputValue(coach, "Marcelo Gallardo");
      });
      submitClubForm(page.container);
      expect(page.container.textContent).toContain("Ya existe un equipo con ese nombre.");

      act(() => setInputValue(clubName, "Nuevo Club Vóley"));
      submitClubForm(page.container);
      expect(page.container.textContent).toContain("Equipo preparado localmente con estado Activo. No se guardó nada.");
      expect(fetchSpy).not.toHaveBeenCalled();
    } finally {
      act(() => page.root.unmount());
      page.container.remove();
      fetchSpy.mockRestore();
    }
  });

  it("opens the design's create-player dialog from the roster button as local state", () => {
    const page = renderPage();

    try {
      // The dialog is component state, not a route: the create screen declares no search
      // contract, so no link may carry a modal query.
      expect(page.container.querySelector('[role="dialog"]')).toBeNull();
      expect(page.container.querySelector('a[href*="modal="]')).toBeNull();

      const addPlayer = [...page.container.querySelectorAll("button")].find(
        (button) => button.textContent === "Agregar jugador",
      );
      expect(addPlayer).not.toBeNull();

      act(() => addPlayer!.click());

      const dialog = page.container.querySelector('[role="dialog"]')!;
      expect(dialog.getAttribute("aria-modal")).toBe("true");
      expect(dialog.textContent).toContain("Crear jugador");
      expect(dialog.textContent).toContain("Integrante del plantel");
      expect(dialog.textContent).toContain("Cancelar");
      expect(dialog.textContent).toContain("Agregar");
      // Design: the `.modal-close` control is named "Cerrar" (voleytrack-admin-crear-equipo.html),
      // which is the label the aligned admin dialogs already pass.
      expect(dialog.querySelector('button[aria-label="Cerrar"]')).not.toBeNull();
    } finally {
      act(() => page.root.unmount());
      page.container.remove();
    }
  });

  it("validates the player fields and adds a removable roster chip", () => {
    const page = renderPage();

    try {
      act(() =>
        [...page.container.querySelectorAll("button")]
          .find((button) => button.textContent === "Agregar jugador")
          ?.click(),
      );

      const form = page.container.querySelector<HTMLFormElement>("#create-team-player-form")!;
      const fullName = getInputByLabel(page.container, "Nombre");
      const number = getInputByLabel(page.container, "Dorsal");
      const position = getSelectByLabel(page.container, "Posición");
      const addButton = [...page.container.querySelectorAll("button")].find(
        (button) => button.textContent === "Agregar",
      )!;

      expect(addButton.getAttribute("form")).toBe("create-team-player-form");
      expect(addButton.getAttribute("type")).toBe("submit");

      act(() => form.requestSubmit());

      expect(fullName.getAttribute("aria-invalid")).toBe("true");
      expect(number.getAttribute("aria-invalid")).toBe("true");
      expect(position.getAttribute("aria-invalid")).toBe("true");
      expect(page.container.querySelector('[role="dialog"]')?.textContent).toContain(
        "Completá los campos obligatorios",
      );

      act(() => {
        setInputValue(fullName, "Sofía Fernández");
        setInputValue(number, "18");
        setSelectValue(position, "Central");
      });
      act(() => form.requestSubmit());

      // The dialog closed and the roster now holds one removable chip.
      expect(page.container.querySelector('[role="dialog"]')).toBeNull();
      expect(page.container.querySelectorAll('[data-testid="create-team-squad-item"]')).toHaveLength(1);
      expect(page.container.textContent).toContain("Sofía Fernández");
      expect(page.container.textContent).toContain("Central · Dorsal #18");

      const remove = page.container.querySelector<HTMLButtonElement>(
        'button[aria-label="Quitar a Sofía Fernández del plantel"]',
      );
      expect(remove).not.toBeNull();

      act(() => remove!.click());

      expect(page.container.querySelectorAll('[data-testid="create-team-squad-item"]')).toHaveLength(0);
      expect(page.container.textContent).toContain("Todavía no cargaste jugadores");
    } finally {
      act(() => page.root.unmount());
      page.container.remove();
    }
  });

  it("closes the player dialog on Cancelar without touching the roster", () => {
    const page = renderPage();

    try {
      act(() =>
        [...page.container.querySelectorAll("button")]
          .find((button) => button.textContent === "Agregar jugador")
          ?.click(),
      );
      expect(page.container.querySelector('[role="dialog"]')).not.toBeNull();

      act(() =>
        [...page.container.querySelectorAll<HTMLButtonElement>('[role="dialog"] button')]
          .find((button) => button.textContent === "Cancelar")
          ?.click(),
      );

      expect(page.container.querySelector('[role="dialog"]')).toBeNull();
      expect(page.container.querySelectorAll('[data-testid="create-team-squad-item"]')).toHaveLength(0);
    } finally {
      act(() => page.root.unmount());
      page.container.remove();
    }
  });
});
