// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { PUBLIC_PLAYERS, PUBLIC_TEAMS } from "../../fixtures";
import { PlayerSelectionModal } from "./PlayerSelectionModal";

describe("PlayerSelectionModal", () => {
  it("renders both team rosters and the selection actions", () => {
    const html = renderToStaticMarkup(
      <PlayerSelectionModal isOpen onClose={() => undefined} />,
    );

    expect(html).toContain("Seleccionar jugadores");
    expect(html).toContain(PUBLIC_TEAMS[0].name);
    expect(html).toContain(PUBLIC_TEAMS[1].name);
    expect(html).toContain(PUBLIC_PLAYERS[0].fullName);
    expect(html).toContain(PUBLIC_PLAYERS[1].fullName);
    expect(html).toContain("Confirmar selección");
  });

  it("does not render when closed", () => {
    const html = renderToStaticMarkup(
      <PlayerSelectionModal isOpen={false} onClose={() => undefined} />,
    );

    expect(html).toBe("");
  });

  it("tracks selected players and updates the selection count", () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    act(() => root.render(<PlayerSelectionModal isOpen onClose={() => undefined} />));
    const checkbox = container.querySelector<HTMLInputElement>(
      `input[aria-label="Seleccionar ${PUBLIC_PLAYERS[0].fullName}"]`,
    );
    expect(checkbox).not.toBeNull();
    expect(checkbox?.checked).toBe(false);
    expect(container.textContent).toContain("0 seleccionados");

    act(() => checkbox?.click());

    expect(checkbox?.checked).toBe(true);
    expect(container.textContent).toContain("1 seleccionados");

    act(() => root.unmount());
    container.remove();
  });
});
