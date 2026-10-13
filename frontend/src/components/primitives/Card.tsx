import type { HTMLAttributes } from "react";

/**
 * Design source: frontend/design/html/voleytrack.css:75-78
 *
 *   .card{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden}
 *   .card-h{padding:18px 20px 0;font-weight:800;font-size:14px;letter-spacing:-0.01em;
 *           display:flex;align-items:center;justify-content:space-between;gap:12px}
 *   .card-h small{font-family:var(--font-mono);font-size:11px;letter-spacing:.06em;
 *                 text-transform:uppercase;color:var(--muted);font-weight:700}
 *   .card-b{padding:18px 20px}
 *
 * `rounded-2xl` is Tailwind v4's 1rem, i.e. the design's 16px radius. The design's
 * `overflow:hidden` belongs to the structural form below; see `padded`.
 */
type CardVariant = "surface" | "raised";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * TRANSITIONAL — migration owner: the per-screen design-alignment slices
   * (consumer migration happens per screen in the later slices).
   *
   * `padded` (the default) is the legacy box the existing 66 `<Card>` call sites were
   * written against: a uniform `p-6` and no clipping. The design's `.card` has no
   * padding of its own — spacing lives in `.card-h` / `.card-b` — so the two forms
   * cannot coexist on one element: a padded container would double up with the
   * header/body padding. Select the design form explicitly with `padded={false}`,
   * which is the only form new code should use.
   *
   * `overflow:hidden` is deliberately part of the structural form only. It is a
   * clipping box, and three production legacy call sites carry absolutely-positioned
   * descendants that clipping can affect (PlayerDetailPage.tsx:220, TeamJourney.tsx:174,
   * MatchSetupPage.tsx:173 — all outside this change's edit surface), so applying it to
   * the transitional form would move 66 screens that are not being verified here.
   */
  padded?: boolean;
  variant?: CardVariant;
};

export function Card({ className = "", padded = true, variant = "surface", ...props }: CardProps) {
  const surfaceClasses = variant === "raised"
    ? "border-vt-raised-border bg-vt-raised"
    : "border-vt-border bg-vt-surface";
  const boxClasses = padded ? "p-6" : "overflow-hidden";

  return (
    <div
      className={`rounded-2xl border ${boxClasses} ${surfaceClasses} ${className}`.trim()}
      {...props}
    />
  );
}

/**
 * `.card-h` (voleytrack.css:76-77): `18px 20px 0` padding, 14px/800 title with
 * -0.01em tracking, and a `justify-between` flex row. A `small` child becomes the
 * design's mono 11px/700 uppercase eyebrow in `--muted`.
 */
export function CardHeader({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex items-center justify-between gap-3 px-5 pt-[18px] text-[14px] font-extrabold tracking-[-0.01em] [&_small]:font-mono [&_small]:text-[11px] [&_small]:font-bold [&_small]:uppercase [&_small]:tracking-[0.06em] [&_small]:text-vt-muted ${className}`.trim()}
      {...props}
    />
  );
}

/** `.card-b` (voleytrack.css:78): `18px 20px`. */
export function CardBody({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-5 py-[18px] ${className}`.trim()} {...props} />;
}
