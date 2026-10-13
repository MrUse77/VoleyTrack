import { Link, useParams } from "@tanstack/react-router";
import { CardBody } from "../../components/primitives/Card";
import { PUBLIC_TOURNAMENTS, type TournamentFixture, type TournamentStatLeaderFixture } from "../../fixtures";
import { TournamentDetailShell, TournamentNotFound, TournamentPanelHeader } from "./TournamentDetailShell";

function findTournament(id: string): TournamentFixture | undefined {
  return PUBLIC_TOURNAMENTS.all.find((tournament) => tournament.id === id);
}

export function TournamentStatsPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const tournament = findTournament(id);

  if (!tournament) return <TournamentNotFound />;

  return (
    <TournamentDetailShell activeTab="estadisticas" tournament={tournament}>
      {/*
       * Design: the detail's statistics section — `card-h` "Estadísticas <small>LIGA A1 ·
       * ATAQUE, BLOQUEO, SAQUE Y RECEPCIÓN</small>" over a `.filters` sub-tab strip
       * (Ataque / Bloqueo / Saque / Recepción) and one rank table per fundament
       * (frontend/design/html/voleytrack-torneos.html). The app's fixture holds one leader
       * per category instead of a per-fundament ranking, so the panel keeps the design's
       * header and period eyebrow and renders the leaders it has; the design's four
       * fundament sub-tabs are not modelled because that ranking has no fixture counterpart.
       */}
      <TournamentPanelHeader eyebrow={`${tournament.name} · LÍDERES INDIVIDUALES`}>
        Estadísticas
      </TournamentPanelHeader>
      <CardBody className="grid gap-4 min-[600px]:grid-cols-2 min-[1200px]:grid-cols-3">
        {tournament.statLeaders.map((leader, index) => (
          <LeaderTile key={`${leader.category}-${leader.teamName}-${index}`} leader={leader} />
        ))}
      </CardBody>
    </TournamentDetailShell>
  );
}

/**
 * A leader tile. The dashboard's already-aligned highlight tiles are plain bordered boxes
 * rather than nested cards (`DashboardPage.tsx`, the `dashboard-highlight` rows), so this
 * follows that precedent instead of putting a card inside the competition card's body.
 */
function LeaderTile({ leader }: { leader: TournamentStatLeaderFixture }) {
  return (
    <div className="rounded-xl border border-vt-border-2 bg-vt-surface-2 p-4">
      <p className="font-mono text-[10px] font-extrabold tracking-[0.08em] text-vt-muted uppercase">
        {leader.category}
      </p>
      {leader.playerId ? (
        <Link className="mt-3 block text-lg font-black text-vt-text hover:underline" to={`/players/${leader.playerId}` as string}>
          {leader.playerName}
        </Link>
      ) : (
        <p className="mt-3 text-lg font-black text-vt-text">{leader.playerName}</p>
      )}
      {leader.teamId ? (
        <Link className="mt-1 inline-block text-xs text-vt-muted hover:text-vt-text" to={`/teams/${leader.teamId}` as string}>
          {leader.teamName}
        </Link>
      ) : (
        <p className="mt-1 text-xs text-vt-muted">{leader.teamName}</p>
      )}
      <p className="mt-4 text-3xl font-black text-vt-accent tabular-nums">
        {leader.value} <span className="text-base font-semibold text-vt-muted">{leader.unit}</span>
      </p>
    </div>
  );
}
