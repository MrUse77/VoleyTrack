// @vitest-environment jsdom
import { useState } from "react";
import { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

function Harness({ onClose = () => undefined }: { onClose?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)} type="button">
        Abrir
      </button>
      <Modal
        description="Datos del staff"
        footer={<button type="button">Guardar cambios</button>}
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          onClose();
        }}
        title="Editar integrante"
      >
        <label htmlFor="probe-staff-name">Nombre completo</label>
        <input id="probe-staff-name" />
      </Modal>
    </div>
  );
}

function renderHarness() {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);
  act(() => root.render(<Harness />));
  return { container, root };
}

function keydown(key: string, shiftKey = false) {
  act(() => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { bubbles: true, cancelable: true, key, shiftKey }),
    );
  });
}

const mounted: Array<{ container: HTMLElement; root: ReturnType<typeof createRoot> }> = [];

function mountHarness() {
  const rendered = renderHarness();
  mounted.push(rendered);
  return rendered;
}

afterEach(() => {
  for (const { container, root } of mounted.splice(0)) {
    act(() => root.unmount());
    container.remove();
  }
});

describe("Modal focus management", () => {
  it("moves focus into the dialog on open and cycles Tab inside it", () => {
    const { container } = mountHarness();
    const trigger = container.querySelector("button")!;

    act(() => trigger.click());

    const dialog = container.querySelector<HTMLElement>('[role="dialog"]')!;
    expect(dialog).not.toBeNull();
    expect(dialog.contains(document.activeElement)).toBe(true);

    const focusable = [...dialog.querySelectorAll<HTMLElement>("button, input")];
    const first = focusable[0];
    const last = focusable.at(-1)!;

    last.focus();
    keydown("Tab");
    expect(document.activeElement).toBe(first);

    first.focus();
    keydown("Tab", true);
    expect(document.activeElement).toBe(last);

    // A Tab from a middle control is left to the browser: the trap only wraps the edges.
    focusable[1].focus();
    keydown("Tab");
    expect(document.activeElement).toBe(focusable[1]);
  });

  it("closes on Escape and restores focus to the control that opened it", () => {
    const onClose = vi.fn();
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    mounted.push({ container, root });
    act(() => root.render(<Harness onClose={onClose} />));

    const trigger = container.querySelector("button")!;
    trigger.focus();
    act(() => trigger.click());
    expect(container.querySelector('[role="dialog"]')).not.toBeNull();

    keydown("Escape");

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("closes through the close control and the backdrop", () => {
    const { container } = mountHarness();
    const trigger = container.querySelector("button")!;

    act(() => trigger.click());
    act(() => container.querySelector<HTMLButtonElement>('button[aria-label="Close modal"]')!.click());
    expect(container.querySelector('[role="dialog"]')).toBeNull();

    act(() => trigger.click());
    const backdrop = container.querySelector<HTMLElement>('[role="presentation"]')!;
    act(() => backdrop.click());
    expect(container.querySelector('[role="dialog"]')).toBeNull();
  });
});
