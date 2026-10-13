import { Link, useParams } from "@tanstack/react-router";
import { Badge } from "../../components/primitives/Badge";
import { Card } from "../../components/primitives/Card";
import type { TeamMatchRow } from "./TeamJourney";
import {
  findTeamJourney,
  TeamJourney,
  teamMatchRows,
  TeamNotFound,
} from "./TeamJourney";

const matchRowGeometry = [
  "min-[1416px]:h-[74px]",
  "min-[1416px]:mt-4 min-[1416px]:h-[74px]",
  "min-[1416px]:mt-8 min-[1416px]:h-16",
  "min-[1416px]:mt-5 min-[1416px]:h-16",
] as const;

export function TeamMatchesPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const context = findTeamJourney(id);

  if (!context) return <TeamNotFound />;

  const matches = teamMatchRows(context);

  return (
    <TeamJourney activeTab="matches" {...context}>
      <section aria-labelledby="team-matches-title">
        <h2 className="mb-4 text-lg font-bold leading-6 text-vt-accent" id="team-matches-title">Partidos del Equipo</h2>
        <Card
          className="p-5 min-[1416px]:h-[520px]"
          data-testid="team-matches-panel"
        >
          {matches.length > 0 ? (
            <ol>
              {matches.map((row, index) => (
                <MatchRow index={index} key={row.match.id} row={row} />
              ))}
            </ol>
          ) : (
            <p className="text-sm text-vt-muted">No hay partidos registrados para este equipo.</p>
          )}
        </Card>
      </section>
    </TeamJourney>
  );
}

function MatchRow({ index, row }: { index: number; row: TeamMatchRow }) {
  const { match } = row;
  const geometry = matchRowGeometry[index] ?? "min-[1416px]:mt-5 min-[1416px]:h-16";
  const content = (
    <div className="grid min-h-16 gap-3 rounded-xl bg-vt-panel p-4 min-[1416px]:h-full min-[1416px]:min-h-0 min-[1416px]:grid-cols-[110px_minmax(0,1fr)_120px_100px] min-[1416px]:items-center">
      <div>
        <Badge variant={resultVariant(row.resultLabel)}>{row.resultLabel}</Badge>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-black text-vt-text">{match.homeTeamName} vs {match.awayTeamName}</p>
        <p className="mt-1 text-xs text-vt-muted">
          {row.contextLabel}{row.contextLabel.includes(match.venue) ? "" : ` · ${match.venue}`}
        </p>
      </div>
      <p className="text-lg font-black text-vt-text">
        {match.score ? `${match.score.home} - ${match.score.away}` : "Programado"}
      </p>
      <p className="text-xs font-bold text-vt-muted min-[1416px]:text-right">
        {match.status === "live" ? "Ver en vivo" : match.badgeLabel}
      </p>
    </div>
  );

  return (
    <li
      data-row-index={index + 1}
      className={geometry}
      data-testid="team-match-row"
    >
      {match.status === "live" ? (
        <Link
          aria-label={`Ver en vivo: ${match.homeTeamName} vs ${match.awayTeamName}`}
          className="block rounded-xl transition hover:ring-1 hover:ring-vt-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent min-[1416px]:h-full"
          to={`/matches/${match.id}/live` as string}
        >
          {content}
        </Link>
      ) : content}
    </li>
  );
}

function resultVariant(label: string): "accent" | "danger" | "default" | "success" {
  if (label === "EN VIVO" || label === "VICTORIA") return "success";
  if (label === "DERROTA") return "danger";
  if (label === "PRÓXIMO") return "accent";
  return "default";
}
