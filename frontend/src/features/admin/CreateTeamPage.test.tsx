// @vitest-environment jsdom
import { act, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { CreateTeamPage } from "./CreateTeamPage";

const fixtureOverride = vi.hoisted(() => ({
  players: undefined as readonly unknown[] | undefined,
}));

vi.mock("../../fixtures", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../fixtures")>();

  return {
    ...actual,
    get PUBLIC_PLAYERS() {
      return fixtureOverride.players ?? actual.PUBLIC_PLAYERS;
    },
  };
});

const navigate = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    search,
    ...props
  }: {
    to: string;
    search?: Record<string, string>;
    children?: ReactNode;
  } & ComponentPropsWithoutRef<"a">) => {
    const query = search ? new URLSearchParams(search).toString() : "";
    return <a {...props} href={query ? `${to}?${query}` : to} />;
  },
  useLocation: () => ({
    search: Object.fromEntries(new URLSearchParams(window.location.search)),
  }),
  useNavigate: () => navigate,
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
    expect(html).toContain("+ Asignar Jugador Libre");
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

  it("validates and locally adds a new player from the add-player modal", () => {
    navigate.mockClear();
    window.history.replaceState({}, "", "/admin/teams/create?modal=player");
    const page = renderPage();

    try {
      const dialog = page.container.querySelector('[role="dialog"]')!;
      expect(dialog.textContent).toContain("Agregar Jugador al Equipo");
      expect(dialog.textContent).toContain("Registra un nuevo jugador y sumalo directamente al plantel.");

      const fullName = getInputByLabel(page.container, "Nombre Completo");
      const number = getInputByLabel(page.container, "Dorsal");
      const position = getInputByLabel(page.container, "Posición");
      const addButton = [...dialog.querySelectorAll("button")].find((button) => button.textContent === "Agregar al plantel")!;

      act(() => addButton.click());

      expect(fullName.getAttribute("aria-invalid")).toBe("true");
      expect(number.getAttribute("aria-invalid")).toBe("true");
      expect(position.getAttribute("aria-invalid")).toBe("true");
      expect(dialog.textContent).toContain("Completá los campos obligatorios");

      act(() => {
        setInputValue(fullName, "Sofía Fernández");
        setInputValue(number, "18");
        setInputValue(position, "Central");
      });
      act(() => addButton.click());

      expect(page.container.textContent).toContain("Sofía Fernández");
      expect(page.container.textContent).toContain("Jugador \"Sofía Fernández\" agregado al plantel local.");
      expect(navigate).toHaveBeenCalledWith({ to: "/admin/teams/create", search: {} });
    } finally {
      act(() => page.root.unmount());
      page.container.remove();
      window.history.replaceState({}, "", "/");
    }
  });

  it("renders a distinct assign-player modal with accessible search and an honest empty state", () => {
    window.history.replaceState({}, "", "/admin/teams/create?modal=assign-player");
    const page = renderPage();

    try {
      const dialog = page.container.querySelector('[role="dialog"]')!;
      expect(dialog.textContent).toContain("Asignar Jugador Libre");
      expect(dialog.textContent).toContain("Buscá en la base de datos a los jugadores que no tienen equipo.");
      expect(dialog.textContent).not.toContain("Agregar Jugador al Equipo");

      const search = getInputByLabel(page.container, "Buscar jugador libre");
      expect(search.type).toBe("search");
      expect(dialog.textContent).toContain("No hay jugadores libres para asignar.");

      act(() => setInputValue(search, "Valentina"));
      expect(dialog.textContent).toContain("No hay jugadores libres para asignar.");
    } finally {
      act(() => page.root.unmount());
      page.container.remove();
      window.history.replaceState({}, "", "/");
    }
  });

  it("does not show a free player again after assigning it to the local roster", () => {
    fixtureOverride.players = [{
      id: "free-player-1",
      teamId: "",
      fullName: "Lucía Libre",
      number: 8,
      position: "Central",
      bio: "Jugadora disponible.",
    }];
    window.history.replaceState({}, "", "/admin/teams/create?modal=assign-player");
    const page = renderPage();

    try {
      const dialog = page.container.querySelector('[role="dialog"]')!;
      expect(dialog.textContent).toContain("Lucía Libre");
      const assignButton = [...dialog.querySelectorAll("button")].find((button) => button.textContent === "Asignar")!;

      act(() => assignButton.click());

      expect(page.container.textContent).toContain('Jugador "Lucía Libre" asignado al plantel local.');
      expect(dialog.textContent).not.toContain("Lucía Libre");
      expect(dialog.textContent).toContain("No hay jugadores libres para asignar.");
    } finally {
      fixtureOverride.players = undefined;
      act(() => page.root.unmount());
      page.container.remove();
      window.history.replaceState({}, "", "/");
    }
  });

  it("uses the canonical player modal URL and removes it on every modal close path", () => {
    navigate.mockClear();
    window.history.replaceState({}, "", "/admin/teams/create?modal=player");
    const page = renderPage();

    try {
      expect(page.container.querySelector('[role="dialog"]')?.textContent).toContain("Agregar Jugador al Equipo");
      expect(page.container.querySelector('[role="dialog"]')?.getAttribute("aria-modal")).toBe("true");
      expect(page.container.querySelector('a[href="/admin/teams/create"]')?.textContent).toContain("Cancelar");

      act(() => page.container.querySelector<HTMLButtonElement>('button[aria-label="Close modal"]')?.click());
      expect(navigate).toHaveBeenLastCalledWith({ to: "/admin/teams/create", search: {} });

      act(() => page.container.querySelector('[role="presentation"]')?.dispatchEvent(new MouseEvent("click", { bubbles: true })));
      expect(navigate).toHaveBeenLastCalledWith({ to: "/admin/teams/create", search: {} });
    } finally {
      act(() => page.root.unmount());
      page.container.remove();
      window.history.replaceState({}, "", "/");
    }
  });

  it("links Agregar Jugador to the canonical modal URL without submitting or changing the roster", () => {
    const page = renderPage();
    const form = page.container.querySelector("form")!;
    const addPlayer = [...page.container.querySelectorAll("a")].find((link) => link.textContent === "+ Agregar Jugador");
    const submitSpy = vi.fn();
    form.addEventListener("submit", submitSpy);

    try {
      expect(addPlayer?.getAttribute("href")).toBe("/admin/teams/create?modal=player");
      expect(page.container.querySelector('[role="dialog"]')).toBeNull();
      expect(page.container.textContent).toContain("Aún no hay jugadores");
      const assignPlayer = [...page.container.querySelectorAll("a")].find((link) => link.textContent === "+ Asignar Jugador Libre");
      expect(assignPlayer?.getAttribute("href")).toBe("/admin/teams/create?modal=assign-player");
      expect(submitSpy).not.toHaveBeenCalled();
    } finally {
      act(() => page.root.unmount());
      page.container.remove();
    }
  });
});
