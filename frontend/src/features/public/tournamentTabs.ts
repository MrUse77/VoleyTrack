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

/**
 * The bracket panel's heading, status pill and intro sentence, per tournament type.
 *
 * It lives here rather than in a page module because two screens render it — the public
 * `Llaves` route and the admin `Llaves` route — and because a route module may only export
 * components (eslint react-refresh/only-export-components).
 *
 * PROTOTYPE COPY, NOT REAL DATA: both sentences, the eyebrow and the status word come from
 * the design's own bracket intros (frontend/design/html/voleytrack-torneos.html, the
 * `bracketIntro` calls for `liga-a1` and `copa-nacional`; the cup word "Programado" is also
 * the admin cup detail's `bracket-status`, voleytrack-admin-ver-copa.html). They must be
 * replaced by real values once the classification rules and the participant list exist.
 */
export const bracketIntroByType = {
  Liga: {
    eyebrow: "PENDIENTE DE CLASIFICACIÓN",
    status: "Pendiente",
    text: "Las llaves se completarán al cerrar la fase regular y confirmar los ocho equipos clasificados.",
    title: "Llaves de playoffs",
  },
  Copa: {
    eyebrow: "PROGRAMADO",
    status: "Programado",
    text: "Los cruces se completarán cuando se confirmen todos los participantes.",
    title: "Llaves de eliminación directa",
  },
} as const;
