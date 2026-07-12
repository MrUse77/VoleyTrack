import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  OfflineState,
  StateBoundary,
  SyncState,
} from "./StateBoundary";

let search: Record<string, string> = {};

vi.mock("@tanstack/react-router", () => ({
  useLocation: () => ({ search }),
}));

function renderBoundary(state?: string) {
  search = state ? { state } : {};
  return renderToStaticMarkup(
    <StateBoundary><p>Contenido de pantalla</p></StateBoundary>,
  );
}

describe("state primitives", () => {
  beforeEach(() => {
    search = {};
  });

  it.each([
    ["loading", LoadingState, "Cargando contenido"],
    ["empty", EmptyState, "No hay resultados"],
    ["error", ErrorState, "No pudimos mostrar esta información"],
    ["offline", OfflineState, "Sin conexión"],
    ["sync", SyncState, "Sincronización completa"],
  ] as const)("renders the %s visual treatment", (_state, Component, label) => {
    const html = renderToStaticMarkup(<Component />);

    expect(html).toContain(label);
    expect(html).toContain('data-testid="ui-state"');
  });

  it.each([
    ["loading", "Cargando contenido"],
    ["empty", "No hay resultados"],
    ["error", "No pudimos mostrar esta información"],
    ["offline", "Sin conexión"],
    ["sync", "Sincronización completa"],
  ])("replaces screen content for the explicit %s override", (state, label) => {
    const html = renderBoundary(state);

    expect(html).toContain(label);
    expect(html).not.toContain("Contenido de pantalla");
  });

  it("preserves content when the state override is absent or invalid", () => {
    expect(renderBoundary()).toContain("Contenido de pantalla");
    expect(renderBoundary("unknown")).toContain("Contenido de pantalla");
  });
});
