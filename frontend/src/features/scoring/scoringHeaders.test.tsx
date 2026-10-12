// @vitest-environment jsdom
import { act } from "react";
import { createRoot } from "react-dom/client";
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { SCORING } from "../../fixtures";
import { MatchSetupPage } from "./MatchSetupPage";
import { PointEntryPage } from "./PointEntryPage";
import { PostMatchSummaryPage } from "./PostMatchSummaryPage";
import { ScoringConsolePage } from "./ScoringConsolePage";

/**
 * The four scoring screens were the only remaining consumers of the legacy `SectionShell`
 * header, which has now been migrated onto the shared `PageHeader` primitive. This file
 * records what the four headers look like after the migration, as a measurement rather than
 * an assumption: the wrapper element and its classes, the header row, the eyebrow's text and
 * treatment, the heading's element, level and typography classes, the description's measure,
 * and the actions container.
 *
 * The rendered pixel values (font-size, letter-spacing, font-family) are Tailwind's, so a
 * static-markup test can only pin the class contract that produces them. The resolved
 * computed values are measured end-to-end by `tools/screenshot.mjs`'s additive
 * `scoringHeader` probe, which is what makes the class contract falsifiable at the pixel
 * level. Nothing here is asserted vacuously: every string below is the exact `className`
 * the screen renders today, and a single character of drift fails the test.
 */
vi.mock("@tanstack/react-router", () => ({
  Link: ({
    activeOptions: _activeOptions,
    children,
    to,
    ...props
  }: { activeOptions?: unknown; children?: ReactNode; to: string } & ComponentPropsWithoutRef<"a">) => {
    void _activeOptions;

    return (
      <a href={to} {...props}>
        {children}
      </a>
    );
  },
  useLocation: () => ({ search: {} }),
  useNavigate: () => () => undefined,
  useParams: () => ({ id: SCORING.summary.matchId }),
}));

/** The exact treatment `PageHeader` renders for all four screens after the migration. */
const ALIGNED_HEADER = {
  wrapperTag: "DIV",
  wrapperClass: "space-y-6",
  headerClass: "flex flex-col items-stretch gap-6 sm:flex-row sm:items-start sm:justify-between",
  columnClass: "min-w-0",
  eyebrowTag: "P",
  eyebrowClass:
    "mt-1.5 font-mono text-[9px] font-extrabold tracking-[0.06em] text-vt-muted-2 uppercase",
  headingTag: "H1",
  headingClass: "text-[28px] font-black leading-none tracking-[-0.02em] text-vt-text",
  descriptionTag: "P",
  descriptionClass: "mt-1.5 max-w-[60ch] text-[13px] text-vt-muted",
  actionsTag: "DIV",
  actionsClass: "flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:justify-end",
} as const;

type ScreenPin = {
  name: string;
  element: ReactElement;
  eyebrow: string;
  heading: string;
  description: string;
  hasActions: boolean;
};

const screens: ScreenPin[] = [
  {
    name: "ScoringConsolePage",
    element: <ScoringConsolePage />,
    eyebrow: "Planillero",
    heading: SCORING.console.title,
    description:
      "Registrá los puntos del partido desde la planilla local. Los cambios se mantienen solo en esta consola.",
    hasActions: true,
  },
  {
    name: "PointEntryPage",
    element: <PointEntryPage />,
    eyebrow: "Planillero",
    heading: SCORING.pointEntry.title,
    description: SCORING.pointEntry.steps[0].description,
    hasActions: false,
  },
  {
    name: "PostMatchSummaryPage",
    element: <PostMatchSummaryPage />,
    eyebrow: "Planillero",
    heading: SCORING.summary.title,
    description: "Resultado final, sets completados y resumen local del partido.",
    hasActions: false,
  },
  {
    name: "MatchSetupPage",
    element: <MatchSetupPage />,
    eyebrow: "Planillero",
    heading: SCORING.matchSetup.title,
    description: SCORING.matchSetup.steps[0].description,
    hasActions: false,
  },
];

function render(element: ReactElement): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = renderToStaticMarkup(element);
  return container;
}

function elementAt(parent: Element, index: number): HTMLElement {
  const child = parent.children[index];
  if (!(child instanceof HTMLElement)) {
    throw new Error(`expected an element at child index ${index}`);
  }
  return child;
}

describe("scoring screen headers", () => {
  for (const screen of screens) {
    it(`${screen.name} pins the migrated PageHeader treatment`, () => {
      const container = render(screen.element);
      const wrapper = elementAt(container, 0);

      // Wrapper element and its classes.
      expect(wrapper.tagName).toBe(ALIGNED_HEADER.wrapperTag);
      expect(wrapper.className).toBe(ALIGNED_HEADER.wrapperClass);

      // The header row is the wrapper's first child, and it holds the text column plus,
      // only where the screen has actions, the actions container.
      const header = elementAt(wrapper, 0);
      expect(header.tagName).toBe("HEADER");
      expect(header.className).toBe(ALIGNED_HEADER.headerClass);

      const column = elementAt(header, 0);
      expect(column.className).toBe(ALIGNED_HEADER.columnClass);
      expect(column.children).toHaveLength(3);

      const eyebrow = elementAt(column, 0);
      expect(eyebrow.tagName).toBe(ALIGNED_HEADER.eyebrowTag);
      expect(eyebrow.className).toBe(ALIGNED_HEADER.eyebrowClass);
      expect(eyebrow.textContent).toBe(screen.eyebrow);

      const heading = elementAt(column, 1);
      expect(heading.tagName).toBe(ALIGNED_HEADER.headingTag);
      expect(heading.className).toBe(ALIGNED_HEADER.headingClass);
      expect(heading.textContent).toBe(screen.heading);

      const description = elementAt(column, 2);
      expect(description.tagName).toBe(ALIGNED_HEADER.descriptionTag);
      expect(description.className).toBe(ALIGNED_HEADER.descriptionClass);
      expect(description.textContent).toBe(screen.description);

      // The migration turns each screen's header into the screen's own single h1.
      expect(container.querySelectorAll("h1")).toHaveLength(1);

      if (screen.hasActions) {
        const actions = elementAt(header, 1);
        expect(actions.tagName).toBe(ALIGNED_HEADER.actionsTag);
        expect(actions.className).toBe(ALIGNED_HEADER.actionsClass);
        expect(actions.textContent).toBe(SCORING.console.statusLabel);
      } else {
        // No actions slot is rendered at all, which is itself the pinned shape.
        expect(header.children).toHaveLength(1);
      }
    });
  }

  it("keeps the setup screen's heading as the pack's programmatic focus target", () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    act(() => root.render(<MatchSetupPage />));

    const heading = container.querySelector<HTMLHeadingElement>("h1");
    expect(heading).not.toBeNull();
    // Design: the pack's setup view gives this h1 `tabindex="-1"`
    // (frontend/design/html/voleytrack-planillero.html:25), which `PageHeader` renders only
    // because the screen supplies `headingRef`.
    expect(heading?.getAttribute("tabindex")).toBe("-1");

    act(() => heading?.focus());
    expect(document.activeElement).toBe(heading);

    act(() => root.unmount());
    container.remove();
  });
});
