// @vitest-environment jsdom
import { act, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ADMIN } from "../../fixtures";
import { AdminStaffPage } from "./AdminStaffPage";

const routerMocks = vi.hoisted(() => ({
  location: { search: {} as Record<string, unknown> },
  navigate: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, ...props }: { to: string; children?: ReactNode } & ComponentPropsWithoutRef<"a">) => (
    <a {...props} href={to} />
  ),
  useLocation: () => routerMocks.location,
  useNavigate: () => routerMocks.navigate,
}));

const member = ADMIN.staff[0];

function visibleText(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function renderPage() {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  act(() => root.render(<AdminStaffPage />));
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

beforeEach(() => {
  routerMocks.location.search = {};
  routerMocks.navigate.mockClear();
});

describe("AdminStaffPage", () => {
  it("SSR renders the design's staff table and its create action on one screen", () => {
    const html = renderToStaticMarkup(<AdminStaffPage />);
    const text = visibleText(html);

    // `renderToStaticMarkup` escapes the ampersand of the design's own label.
    expect(text).toContain("Staff &amp; gestión");
    expect(text).toContain("+ Nuevo integrante");
    expect(text).toContain("Staff");
    expect(text).toContain("Rol");
    expect(text).toContain("Email");
    expect(text).toContain("Torneo");
    expect(text).toContain("Acciones");
    expect(text).toContain(member.fullName);
    expect(text).toContain(member.roleLabel);
    expect(text).toContain(member.email);
    expect(text).toContain(member.tournamentLabel);
    expect(html).toContain('aria-label="Editar Mariana López"');
    // The dialog is not part of the closed screen.
    expect(html).not.toContain('role="dialog"');
  });

  it("SSR renders the create dialog with the design's four fields when the route asks for it", () => {
    routerMocks.location.search = { nuevo: true };

    const html = renderToStaticMarkup(<AdminStaffPage />);
    const text = visibleText(html);

    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('aria-label="Cerrar"');
    expect(text).toContain("Nuevo integrante");
    expect(text).toContain("Alta de un miembro del staff");
    expect(text).toContain("Nombre completo");
    expect(text).toContain("Email");
    expect(text).toContain("Rol");
    expect(text).toContain("Torneo asignado");
    expect(text).toContain("Guardar integrante");
    expect(text).toContain("Cancelar");
    expect(text).toContain("Planillero");
    expect(text).toContain("Árbitro");
  });

  it("opens the edit dialog from the row action and pre-fills the record", () => {
    const rendered = renderPage();

    try {
      const editButton = rendered.container.querySelector<HTMLButtonElement>(
        `button[aria-label="Editar ${member.fullName}"]`,
      );
      expect(editButton).not.toBeNull();

      act(() => editButton?.click());
      expect(routerMocks.navigate).toHaveBeenCalledWith({
        to: "/admin/staff/register",
        search: { editar: member.id },
      });

      routerMocks.location.search = { editar: member.id };
      act(() => rendered.root.render(<AdminStaffPage />));

      expect(rendered.container.querySelector('[role="dialog"]')).not.toBeNull();
      expect(rendered.container.textContent).toContain("Editar integrante");
      expect(rendered.container.textContent).toContain("Guardar cambios");
      expect(getControlByLabel<HTMLInputElement>(rendered.container, "Nombre completo").value).toBe(member.fullName);
      expect(getControlByLabel<HTMLInputElement>(rendered.container, "Email").value).toBe(member.email);
      expect(getControlByLabel<HTMLSelectElement>(rendered.container, "Rol").value).toBe(member.role);
      expect(getControlByLabel<HTMLSelectElement>(rendered.container, "Torneo asignado").value).toBe(
        member.tournamentLabel,
      );
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });

  it("keeps the edited member locally, closes the dialog and writes nothing to the network", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network requests are not allowed"));
    routerMocks.location.search = { editar: member.id };

    const rendered = renderPage();

    try {
      const form = rendered.container.querySelector("form")!;
      const fullName = getControlByLabel<HTMLInputElement>(rendered.container, "Nombre completo");
      const email = getControlByLabel<HTMLInputElement>(rendered.container, "Email");

      act(() => {
        setInputValue(fullName, "Ana Peralta");
        setInputValue(email, "ana@voleytrack.test");
      });

      act(() => form.requestSubmit());

      expect(fetchSpy).not.toHaveBeenCalled();
      // The dialog is part of the URL, so closing it is the navigation the screen performs.
      expect(routerMocks.navigate).toHaveBeenCalledWith({ to: "/admin/staff/register", search: {} });
      routerMocks.location.search = {};
      act(() => rendered.root.render(<AdminStaffPage />));

      expect(rendered.container.querySelector('[role="dialog"]')).toBeNull();
      expect(rendered.container.textContent).toContain("Ana Peralta");
      expect(rendered.container.textContent).toContain("No se enviaron datos al servidor.");
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
      fetchSpy.mockRestore();
    }
  });

  it("reports an invalid email through the field's own error slot", () => {
    routerMocks.location.search = { nuevo: true };

    const rendered = renderPage();

    try {
      const form = rendered.container.querySelector("form")!;
      const email = getControlByLabel<HTMLInputElement>(rendered.container, "Email");

      act(() => {
        setInputValue(getControlByLabel<HTMLInputElement>(rendered.container, "Nombre completo"), "Ana Peralta");
        setInputValue(email, "no-es-un-email");
      });

      act(() => form.requestSubmit());

      expect(email.getAttribute("aria-invalid")).toBe("true");
      const describedBy = email.getAttribute("aria-describedby");
      expect(describedBy).toBe("staff-email-error");
      expect(rendered.container.querySelector(`#${describedBy}`)?.textContent).toBe("Ingresá un email válido.");
      expect(rendered.container.querySelector('[role="dialog"]')).not.toBeNull();
    } finally {
      act(() => rendered.root.unmount());
      rendered.container.remove();
    }
  });
});
