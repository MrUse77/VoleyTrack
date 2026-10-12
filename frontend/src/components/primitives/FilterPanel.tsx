import type { KeyboardEvent, ReactNode } from "react";
import { Card, CardBody } from "./Card";
import { buttonClasses } from "./buttonClasses";
import { Field, fieldControlClasses } from "./Field";

/**
 * The design's collapsible filter panel, and the `Filtros` toggle that drives it.
 *
 * Design source: frontend/design/html/voleytrack-partidos.css:12-23 (.match-filters and its
 * .match-filters-inner / .match-filter-grid / .match-filter-field / .match-filter-footer /
 * .match-results-count) and frontend/design/html/voleytrack-torneos.css:3-14, which is the
 * same block under the tournament names. The markup it renders is
 * frontend/design/html/voleytrack-partidos.html:45-58:
 *
 *   <button class="btn" aria-expanded="false" aria-controls="matches-filter-panel"
 *           id="matches-filter-button"><svg .../> Filtros</button>
 *   <div class="match-filters" id="matches-filter-panel" aria-hidden="true">
 *     <div class="match-filters-inner">
 *       <div class="match-filter-grid">…one .match-filter-field per labelled <select>…</div>
 *       <div class="match-filter-footer">
 *         <p class="match-results-count" aria-live="polite"><strong>5</strong> partidos</p>
 *         <button class="btn ghost" id="matches-clear-filters">Limpiar filtros</button>
 *       </div>
 *     </div>
 *   </div>
 *
 * The design's panel is not a pill group: it is a labelled `<select>` per dimension, which is
 * an accessible form control in its own right (each control gets a real `<label for>` through
 * the `Field` primitive), plus the design's result count and its `Limpiar filtros` action. The
 * panel's two class blocks differ only in their names, so the structure lives here once instead
 * of twice.
 *
 * Divergences from the design, both deliberate:
 * - The design animates the panel with `max-height`/`opacity`/`visibility` and hides it with
 *   `aria-hidden`. This app's four existing panels (AdminMatchesPage and siblings) keep the
 *   panel in the DOM and close it with the `hidden` attribute, so `aria-controls` always
 *   resolves AND the closed panel leaves the accessibility tree and the tab order. `hidden` is
 *   kept here for the same reason; the design's transition is therefore not rendered.
 * - The design's `.match-filter-field select` is 44px tall with the 10px `--radius-sm`; the
 *   app's shared `fieldControlClasses` is the design's own generic control rule
 *   (frontend/design/html/voleytrack-admin.css:180: 46px, 12px radius, --bg fill, --border
 *   edge) and is what all four existing panels already use, so the panel keeps the app's single
 *   form-field concept instead of adding a second select treatment.
 */

/**
 * The design pairs the panel's id with its toggle's id: `#matches-filter-panel` is controlled
 * by `#matches-filter-button` (voleytrack-partidos.html:45,47). Both components derive the same
 * name so the toggle is reachable from the panel's Escape handling without a second prop.
 */
function toggleIdFor(panelId: string): string {
  return `${panelId.replace(/-panel$/, "")}-button`;
}

type FilterPanelToggleProps = {
  /** The id of the panel this button expands; also becomes the button's own id. */
  controls: string;
  isOpen: boolean;
  onToggle: () => void;
};

/**
 * The design's `.btn` toggle in the page head's `.head-actions` slot. It is a real `<button>`,
 * so it is operable by keyboard (Enter/Space) and it publishes its state through
 * `aria-expanded`, with `aria-controls` pointing at the panel. The design closes the panel on
 * Escape and returns focus to this control (voleytrack-partidos.html:139-144); because the
 * toggle is where focus sits when the panel opens, Escape here only has to close it.
 */
export function FilterPanelToggle({ controls, isOpen, onToggle }: FilterPanelToggleProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape" && isOpen) onToggle();
  };

  return (
    <button
      aria-controls={controls}
      aria-expanded={isOpen}
      className={buttonClasses("surface", "md", "min-h-11")}
      id={toggleIdFor(controls)}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      type="button"
    >
      <svg
        aria-hidden="true"
        fill="none"
        height="16"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="16"
      >
        <path d="M3 6h18" />
        <path d="M7 12h10" />
        <path d="M10 18h4" />
      </svg>
      Filtros
    </button>
  );
}

type FilterPanelProps = {
  /** The design's result count noun, singular and plural ("partido"/"partidos"). */
  countPlural: string;
  countSingular: string;
  /** The filtered result count, printed by the design as `<strong>N</strong> partidos`. */
  count: number;
  /** `data-testid` for the count line, so a screen's own test can read it. */
  countTestId?: string;
  /** The design's panel id; the toggle derives its own id from it. */
  id: string;
  isOpen: boolean;
  /** Closes the panel (the design's Escape handling; focus returns to the toggle). */
  onClose: () => void;
  /** The design's `Limpiar filtros` action. */
  onClear: () => void;
  /** One `Field` per dimension, laid out by the design's `.match-filter-grid`. */
  children: ReactNode;
};

/**
 * The design's panel body: the `.match-filter-grid` of labelled controls and the
 * `.match-filter-footer` with the count and the clear action. `Card`/`CardBody` reproduce
 * `.match-filters` (16px radius, `--surface` fill, `--border` edge) and
 * `.match-filters-inner` (`padding:18px 20px`) exactly.
 */
export function FilterPanel({
  children,
  count,
  countPlural,
  countSingular,
  countTestId,
  id,
  isOpen,
  onClear,
  onClose,
}: FilterPanelProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape" || !isOpen) return;

    onClose();
    // The design returns focus to `#…-filter-button` when Escape closes the panel from inside
    // it (voleytrack-partidos.html:139-144).
    document.getElementById(toggleIdFor(id))?.focus();
  };

  return (
    <Card className="mb-4" hidden={!isOpen} id={id} padded={false}>
      <CardBody onKeyDown={handleKeyDown}>
        <div className="grid gap-3 min-[561px]:grid-cols-[repeat(2,minmax(140px,1fr))] min-[1101px]:grid-cols-[repeat(3,minmax(140px,1fr))]">
          {children}
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-vt-border-2 pt-[14px] max-[560px]:flex-col max-[560px]:items-stretch">
          <p
            aria-live="polite"
            className="m-0 font-mono text-[11px] font-bold text-vt-muted"
            data-testid={countTestId}
          >
            <strong className="text-vt-text">{count}</strong>{" "}
            {count === 1 ? countSingular : countPlural}
          </p>
          <button
            className={buttonClasses("ghost", "md", "min-h-11")}
            onClick={onClear}
            type="button"
          >
            Limpiar filtros
          </button>
        </div>
      </CardBody>
    </Card>
  );
}

type FilterPanelSelectProps = {
  id: string;
  label: string;
  onChange: (value: string) => void;
  options: readonly { label: string; value: string }[];
  value: string;
};

/**
 * One dimension of the design's `.match-filter-grid`: a `.match-filter-field` holding a real
 * `<label for>` and its `<select>`. `Field` owns the label/control wiring (id, aria-describedby,
 * aria-invalid) and `fieldControlClasses` is the design's own control spec, so every control in
 * the panel is labelled and shares one treatment.
 */
export function FilterPanelSelect({ id, label, onChange, options, value }: FilterPanelSelectProps) {
  return (
    <Field id={id} label={label}>
      <select
        className={fieldControlClasses}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
