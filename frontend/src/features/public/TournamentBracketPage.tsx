import { useParams } from "@tanstack/react-router";
import { PUBLIC_TOURNAMENTS, type TournamentFixture } from "../../fixtures";
import { TournamentBracket, TournamentBracketIntro } from "./TournamentBracket";
import { TournamentDetailShell, TournamentNotFound, TournamentPanelHeader } from "./TournamentDetailShell";
import { bracketIntroByType } from "./tournamentTabs";

function findTournament(id: string): TournamentFixture | undefined {
  return PUBLIC_TOURNAMENTS.all.find((tournament) => tournament.id === id);
}

export function TournamentBracketPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const tournament = findTournament(id);

  if (!tournament) return <TournamentNotFound />;

  const intro = bracketIntroByType[tournament.type];

  return (
    <TournamentDetailShell activeTab="llaves" tournament={tournament}>
      {/*
       * Design: the league detail's `Playoffs` panel and the cup detail's `Llaves` panel —
       * `card-h` "Llaves de playoffs <small>PENDIENTE DE CLASIFICACIÓN</small>" (or "Llaves de
       * eliminación directa <small>…</small>") over `.bracket-intro` and the bracket itself
       * (frontend/design/html/voleytrack-torneos.html). The label branches on the fixture's
       * tournament type, which is the same dimension the design's two details differ on.
       */}
      <TournamentPanelHeader eyebrow={intro.eyebrow}>{intro.title}</TournamentPanelHeader>
      <TournamentBracketIntro status={intro.status}>{intro.text}</TournamentBracketIntro>
      <TournamentBracket rounds={tournament.bracketRounds} />
    </TournamentDetailShell>
  );
}
