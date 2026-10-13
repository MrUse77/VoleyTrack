import { useParams } from "@tanstack/react-router";
import { Badge } from "../../components/primitives/Badge";
import { Card, CardBody } from "../../components/primitives/Card";
import { InfoRow } from "../../components/primitives/InfoRow";
import { Num } from "../../components/primitives/Num";
import { TournamentPanelHeader } from "../public/TournamentDetailShell";
import { teamMatchRows, teamPerformanceBadges, teamPerformanceReadout } from "../public/TeamJourney";
import { AdminTeamNotFound } from "./AdminTeamNotFound";
import { AdminTeamShell } from "./AdminTeamShell";
import { findAdminTeam } from "./adminTeamLookup";

/**
 * The admin team detail's landing, i.e. the design's `Detalle` tab.
 *
 * Design: frontend/design/html/voleytrack-admin-ver-equipo.html — a 320px / 1fr grid whose
 * first card is `Perfil` (a plain `<h3>` over five `.info-row`s: Nombre, Sede, Torneo,
 * Entrenador, Jugadores) and whose second is `Rendimiento <small>ÚLTIMOS 5</small>` (a
 * `.card-h` over result pills and a small label/value readout).
 *
 * The pills and the readout come from the shared `TeamJourney` helpers, which the public team
 * detail renders too, so the two sides cannot disagree on the same result.
 *
 * Recorded divergence, forced by the fixtures rather than chosen: the design's readout is
 * `Ataque efectivo 47%`, `Bloqueos / set 2.4`, `Errores no forzados 11.2`. The app has no
 * per-set or unforced-error metric, so the card reports the real per-match average of each
 * `summaryStats` total instead of printing numbers nothing backs.
 */
export function AdminTeamDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const context = findAdminTeam(id);

  if (!context) return <AdminTeamNotFound />;

  const { team, detail } = context;
  const rosterCount = detail ? detail.rosterStats.length : team.rosterPlayerIds.length;
  const matches = teamMatchRows(context);
  const badges = teamPerformanceBadges(matches, team.id);
  const readout = detail ? teamPerformanceReadout(detail) : [];

  return (
    <AdminTeamShell activeTab="overview" context={context}>
      <section
        aria-label="Resumen del equipo"
        className="grid gap-4 min-[901px]:grid-cols-[320px_1fr]"
        data-testid="admin-team-overview-grid"
      >
        <Card padded={false}>
          <div className="p-[18px]">
            <h2 className="mb-3 text-[16px] font-black text-vt-text">Perfil</h2>
            <InfoRow label="Nombre" value={team.name} />
            <InfoRow label="Sede" value={team.city} />
            <InfoRow label="Torneo" value={detail?.tournamentName ?? "—"} />
            <InfoRow label="Entrenador" value={team.coach} />
            <InfoRow label="Jugadores" value={String(rosterCount)} />
          </div>
        </Card>

        <Card padded={false}>
          <TournamentPanelHeader eyebrow="ÚLTIMOS 5">Rendimiento</TournamentPanelHeader>
          <CardBody data-testid="admin-team-performance-card-body">
            {badges.length > 0 ? (
              <ul aria-label="Últimos resultados" className="m-0 mb-[14px] flex list-none flex-wrap gap-2 p-0">
                {badges.map((badge) => (
                  <li key={badge.id}>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="m-0 text-[13px] text-vt-muted">No hay resultados registrados para este equipo.</p>
            )}
            {readout.length > 0 ? (
              <dl className="m-0">
                {readout.map((row) => (
                  <div className="flex items-center justify-between border-b border-vt-border-2 py-2 last:border-b-0" key={row.label}>
                    <dt className="text-[13px] text-vt-muted">{row.label}</dt>
                    <dd className="m-0"><Num>{row.value}</Num></dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </CardBody>
        </Card>
      </section>
    </AdminTeamShell>
  );
}
