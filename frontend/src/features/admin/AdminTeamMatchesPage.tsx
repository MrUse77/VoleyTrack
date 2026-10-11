import { useParams } from "@tanstack/react-router";
import { Badge, type BadgeVariant } from "../../components/primitives/Badge";
import { Card, CardBody } from "../../components/primitives/Card";
import { TournamentPanelHeader } from "../public/TournamentDetailShell";
import { teamMatchRows } from "../public/TeamJourney";
import { AdminTeamNotFound } from "./AdminTeamNotFound";
import { AdminTeamShell } from "./AdminTeamShell";
import { findAdminTeam } from "./adminTeamLookup";

/**
 * The admin team detail's `Partidos` tab.
 *
 * Design: frontend/design/html/voleytrack-admin-ver-equipo.html — a card headed
 * `Partidos <small>PRÓXIMOS · LIGA A1</small>` whose rows are `.mini-match`: a `.mm-result`
 * box (the score, or `VS` for a scheduled match), the two team names, the date and a state
 * badge. The state is carried by the result box's text and by the badge's word, never by
 * colour alone.
 *
 * The rows are the shared `teamMatchRows`, so the admin list and the public list agree on the
 * same team's fixtures and on each result label.
 */
function resultBoxClasses(label: string): string {
  if (label === "VICTORIA") return "border-vt-success/30 bg-vt-success/10 text-vt-success";
  if (label === "DERROTA") return "border-vt-danger/30 bg-vt-danger/10 text-vt-danger";
  if (label === "EN VIVO") return "border-vt-accent/35 bg-vt-accent/10 text-vt-accent";
  return "border-vt-border bg-vt-background text-vt-muted";
}

function resultBadgeVariant(label: string): BadgeVariant {
  if (label === "VICTORIA") return "ok";
  if (label === "DERROTA") return "danger";
  if (label === "EN VIVO") return "accent";
  return "default";
}

export function AdminTeamMatchesPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const context = findAdminTeam(id);

  if (!context) return <AdminTeamNotFound />;

  const { team, detail } = context;
  const matches = teamMatchRows(context);

  return (
    <AdminTeamShell activeTab="matches" context={context}>
      <Card padded={false}>
        <TournamentPanelHeader eyebrow={`PRÓXIMOS · ${detail?.tournamentName ?? team.category}`}>
          Partidos
        </TournamentPanelHeader>
        <CardBody data-testid="admin-team-matches-card-body">
          {matches.length > 0 ? (
            <ul className="m-0 list-none p-0">
              {matches.map((row) => {
                const score = row.match.score ? `${row.match.score.home}-${row.match.score.away}` : "VS";

                return (
                  <li
                    className="flex items-center gap-3 border-b border-vt-border-2 py-3 last:border-b-0"
                    key={row.match.id}
                  >
                    <span
                      className={`grid h-[30px] w-11 shrink-0 place-items-center rounded-[9px] border font-mono text-[13px] font-extrabold ${resultBoxClasses(row.resultLabel)}`}
                    >
                      {score}
                    </span>
                    <p className="m-0 min-w-0 flex-1 text-[13px] text-vt-text">
                      <b>{row.match.homeTeamName}</b> vs <b>{row.match.awayTeamName}</b>
                    </p>
                    <small className="shrink-0 text-[12px] text-vt-muted">{row.contextLabel}</small>
                    <Badge variant={resultBadgeVariant(row.resultLabel)}>{row.resultLabel}</Badge>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="m-0 text-[13px] text-vt-muted">No hay partidos registrados para este equipo.</p>
          )}
        </CardBody>
      </Card>
    </AdminTeamShell>
  );
}
