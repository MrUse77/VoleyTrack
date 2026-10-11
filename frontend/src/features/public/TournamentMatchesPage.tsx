import { Link, useParams } from "@tanstack/react-router";
import { Badge } from "../../components/primitives/Badge";
import { DataTable, type DataTableColumn } from "../../components/primitives/DataTable";
import { PUBLIC_MATCHES, PUBLIC_TOURNAMENTS, type MatchFixture, type TournamentFixture } from "../../fixtures";
import { TournamentDetailShell, TournamentNotFound, TournamentPanelHeader } from "./TournamentDetailShell";

const statusVariants = {
  finished: "default",
  live: "danger",
  today: "accent",
  upcoming: "default",
} as const;

const statusLabels = {
  finished: "Finalizado",
  live: "En vivo",
  today: "Hoy",
  upcoming: "Programado",
} as const;

function findTournament(id: string): TournamentFixture | undefined {
  return PUBLIC_TOURNAMENTS.all.find((tournament) => tournament.id === id);
}

function findTournamentMatches(id: string): readonly MatchFixture[] {
  return [PUBLIC_MATCHES.live, PUBLIC_MATCHES.today, PUBLIC_MATCHES.upcoming, PUBLIC_MATCHES.finished]
    .flat()
    .filter((match) => match.tournamentId === id);
}

/**
 * The design's matches card is a table with `Partido | Fecha | Hora | Estado`
 * (frontend/design/html/voleytrack-torneos.html, the `matchesCard` table). The app's fixture
 * keeps a match's date and time in one `scheduledLabel` and also carries its venue, so this
 * table reports `Partido | Programación | Sede | Estado` rather than splitting a label the
 * data does not split, and its rows link the match to the live detail.
 */
const columns: DataTableColumn<MatchFixture>[] = [
  {
    header: "Partido",
    key: "homeTeamName",
    render: (match) => (
      <Link className="hover:underline" to={`/matches/${match.id}/live` as string}>
        <b className="font-bold text-vt-text">{match.homeTeamName}</b>{" "}
        <span className="text-vt-muted">vs</span>{" "}
        <b className="font-bold text-vt-text">{match.awayTeamName}</b>
      </Link>
    ),
  },
  { header: "Programación", key: "scheduledLabel" },
  { header: "Sede", key: "venue" },
  {
    header: "Estado",
    key: "badgeLabel",
    render: (match) => (
      <span className="flex flex-wrap items-center gap-2">
        <Badge variant={statusVariants[match.status]}>
          {match.badgeLabel}
        </Badge>
        {match.score ? (
          <span className="font-mono text-[12px] font-bold text-vt-muted tabular-nums">
            {match.score.home}-{match.score.away}
          </span>
        ) : (
          <span className="font-mono text-[12px] font-bold text-vt-muted">{statusLabels[match.status]}</span>
        )}
      </span>
    ),
  },
];

export function TournamentMatchesPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const tournament = findTournament(id);

  if (!tournament) return <TournamentNotFound />;

  const matches = findTournamentMatches(tournament.id);

  return (
    <TournamentDetailShell activeTab="partidos" tournament={tournament}>
      {/*
       * Design: the detail's matches section — `card-h` "Próximos partidos <small>JORNADA
       * 15</small>" over `.table-wrap` (frontend/design/html/voleytrack-torneos.html). The
       * app has no matchday number in its fixtures, so the eyebrow reports the fixture count
       * it does have instead of printing an invented matchday.
       */}
      <TournamentPanelHeader eyebrow={`${matches.length} PARTIDOS`}>Próximos partidos</TournamentPanelHeader>
      <DataTable
        columns={columns}
        getRowKey={(match) => match.id}
        rows={[...matches]}
        wrapperClassName="rounded-none border-0 bg-transparent"
      />
    </TournamentDetailShell>
  );
}
