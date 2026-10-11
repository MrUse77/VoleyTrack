/**
 * The tournament detail's tab set, as the routes that actually exist.
 *
 * It also holds the one status-to-badge mapping both tournament screens share, so this stays a
 * constants module with no components (eslint react-refresh/only-export-components).
 *
 * Design: frontend/design/html/voleytrack-torneos.html renders the detail as one page whose
 * `.tor-tabs` strip holds the competition content only — `Clasificación` + `Playoffs` for a
 * league, `Participantes` + `Llaves` for a cup — while the page head, the KPI grid and the
 * `Información` card sit above it, outside the tab strip, and the matches and statistics
 * cards sit below it. The app implements that content as five sibling routes instead, so
 * the tab labels adopt the design's own words where a route has a counterpart:
 *
 * - `Tabla` → `Clasificación` (the design's tab label and its panel header
 *   `Clasificación <small>TOP 5</small>`, same file).
 * - `Cuadro` → `Llaves` (the design's tab label for the knockout panel; a league calls the
 *   same widget `Playoffs`, which is why one generic route serves both formats).
 * - `Resumen`, `Partidos` and `Estadísticas` keep their names: they are the design's own
 *   page-head/KPI/Información landing, its "Próximos partidos" card and its "Estadísticas"
 *   card, which the app splits into routes because `src/router.tsx` already defines them.
 * - The design's `Participantes` tab is deliberately not added: it would need a sixth
 *   route in `src/router.tsx` (outside this change's edit surface), and its `Torneo` column
 *   — each participant's source competition — has no counterpart in the standings fixture.
 */
import type { TournamentStatus } from "../../fixtures";

/**
 * Design: `.badge.ok` for "En curso" and `.badge.warn` for "Próximo" (voleytrack.css:102-103),
 * shared by the tournaments list card and the detail page head so the two screens cannot
 * drift apart on the same tournament status.
 */
export const badgeVariantByStatus: Record<TournamentStatus, "ok" | "warn" | "default"> = {
  "in-progress": "ok",
  upcoming: "warn",
  finished: "default",
};

export type TournamentTab = {
  label: string;
  suffix: string;
  value: string;
};

export const tournamentTabs: readonly TournamentTab[] = [
  { label: "Resumen", suffix: "", value: "resumen" },
  { label: "Partidos", suffix: "/matches", value: "partidos" },
  { label: "Clasificación", suffix: "/standings", value: "clasificacion" },
  { label: "Estadísticas", suffix: "/stats", value: "estadisticas" },
  { label: "Llaves", suffix: "/bracket", value: "llaves" },
];
