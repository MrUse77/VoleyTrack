// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { MatchesBrowser } from "../components/MatchesBrowser";
import { MATCHES_BROWSER_VM, type MatchesBrowserVm } from "../matches.models";

function matchCenterWithActiveFilter(label: string): MatchesBrowserVm {
  return {
    ...MATCHES_BROWSER_VM,
    filters: MATCHES_BROWSER_VM.filters.map((filter) => ({
      label: filter.label,
      active: filter.label === label,
    })),
  };
}

function filterButton(container: HTMLElement, label: string) {
  return Array.from(container.querySelectorAll<HTMLButtonElement>("button")).find(
    (button) => button.textContent === label,
  );
}

describe("useMatchCenterFilter through MatchesBrowser", () => {
  let container: HTMLDivElement;
  let root: Root | undefined;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  });

  afterEach(() => {
    if (root) {
      act(() => root?.unmount());
      root = undefined;
    }
    container.remove();
  });

  function renderMatchCenter(matchCenter: MatchesBrowserVm) {
    act(() => {
      root = createRoot(container);
      root.render(<MatchesBrowser matchCenter={matchCenter} />);
    });
  }

  function rerenderMatchCenter(matchCenter: MatchesBrowserVm) {
    act(() => {
      root?.render(<MatchesBrowser matchCenter={matchCenter} />);
    });
  }

  // This pins the INITIALIZER only: the view model's declared active filter seeds the first
  // `useState`, so the very first commit is already filtered and no `ALL` frame is painted.
  // It deliberately does NOT prove the render-phase sync in `useMatchCenterFilter` — on a
  // first mount there is nothing to sync, so this test would also pass if that block were
  // deleted. The two tests below are the ones that pin the sync, because they re-render a
  // mounted tree with a different declared filter and assert the corrected output is
  // committed without an intervening effects pass (assertions run synchronously after
  // `act`, with no `await`).
  it("seeds the selected filter from the view model's declared active filter on the first render", () => {
    renderMatchCenter(matchCenterWithActiveFilter("LIVE"));

    expect(container.textContent).toContain("Brazil");
    expect(container.textContent).not.toContain("Scheduled");
    expect(container.textContent).not.toContain("Completed");
    expect(filterButton(container, "LIVE")?.getAttribute("aria-current")).toBe("page");
    expect(filterButton(container, "RESULTS")?.getAttribute("aria-current")).toBeNull();
  });

  it("follows the view model when its active filter changes after the first render", () => {
    renderMatchCenter(matchCenterWithActiveFilter("LIVE"));
    expect(container.textContent).toContain("Brazil");

    rerenderMatchCenter(matchCenterWithActiveFilter("RESULTS"));

    expect(container.textContent).toContain("Completed");
    expect(container.textContent).not.toContain("Brazil");
    expect(filterButton(container, "RESULTS")?.getAttribute("aria-current")).toBe("page");
    expect(filterButton(container, "LIVE")?.getAttribute("aria-current")).toBeNull();
  });

  it("switches sections from the filter buttons and follows the view model again", () => {
    renderMatchCenter(matchCenterWithActiveFilter("ALL"));
    expect(container.textContent).toContain("Brazil");
    expect(container.textContent).toContain("Scheduled");
    expect(container.textContent).toContain("Completed");

    act(() => {
      filterButton(container, "RESULTS")?.dispatchEvent(
        new MouseEvent("click", { bubbles: true, cancelable: true }),
      );
    });

    expect(container.textContent).toContain("Completed");
    expect(container.textContent).not.toContain("Brazil");
    expect(container.textContent).not.toContain("Scheduled");
    expect(filterButton(container, "RESULTS")?.getAttribute("aria-current")).toBe("page");

    rerenderMatchCenter(matchCenterWithActiveFilter("LIVE"));

    expect(container.textContent).toContain("Brazil");
    expect(container.textContent).not.toContain("Completed");
    expect(filterButton(container, "LIVE")?.getAttribute("aria-current")).toBe("page");
  });
});
