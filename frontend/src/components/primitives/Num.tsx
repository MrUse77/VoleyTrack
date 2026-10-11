import type { ReactNode } from "react";

/**
 * The design's `.num` treatment, as one utility triplet over tokens.
 *
 * Design source: frontend/design/html/voleytrack.css:100
 *   .num{font-family:var(--font-mono);font-variant-numeric:tabular-nums;text-align:right}
 *
 * It is exported as a single constant because the triplet only works whole: dropping
 * `tabular-nums` still renders mono digits but they advance by glyph width, so columns
 * of numbers stop lining up — the exact failure the design treatment exists to prevent.
 * Call sites repeat a name, never the utilities.
 *
 * `text-align` only positions the inline content inside a *block* container. On an
 * inline element (`<span>`, `<a>`) it is inert: the alignment must come from the block
 * that owns the text flow, typically a `<td>`/`<th>` or a flex/grid parent. Cells
 * therefore apply this constant directly to themselves instead of wrapping their text
 * in an inline element.
 */
export const numClasses = "font-mono tabular-nums text-right";

type NumProps = {
  children?: ReactNode;
  className?: string;
};

/**
 * Inline default for the `.num` treatment outside tables. It contributes the mono
 * family and the tabular figures; the `text-right` it carries has no effect on the
 * inline box itself, so put it in a right-aligned block (or use the cell variant in
 * `DataTableColumn`) when the numbers must actually line up.
 */
export function Num({ children, className = "" }: NumProps) {
  return <span className={`${numClasses} ${className}`.trim()}>{children}</span>;
}
