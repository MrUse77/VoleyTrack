import { useParams } from "@tanstack/react-router";
import { TournamentBracket, TournamentBracketIntro } from "../public/TournamentBracket";
import { TournamentPanelHeader } from "../public/TournamentDetailShell";
import { bracketIntroByType } from "../public/tournamentTabs";
import { AdminTournamentNotFound } from "./AdminTournamentNotFound";
import { AdminTournamentShell } from "./AdminTournamentShell";
import { findAdminTournament } from "./adminTournamentLookup";

/**
 * The admin tournament's bracket view.
 *
 * Design: frontend/design/html/voleytrack-admin-ver-copa.html — the cup detail's `Llaves`
 * tab panel: a `.card-h` reading "Llaves de eliminación directa <small>16 EQUIPOS ·
 * PROGRAMADO</small>", the `.bracket-intro` row (a `bracket-status` pill plus its sentence) and
 * the `.bracket-scroll` board of round columns. voleytrack-admin-ver-torneo.html renders the
 * same panel for a league under `Playoffs` ("Llaves de playoffs <small>PENDIENTE DE
 * CLASIFICACIÓN</small>"), which is why the heading and its intro branch on the tournament type
 * — the one dimension the design's two details differ on.
 *
 * Nothing here is rebuilt: the board is the public `TournamentBracket` widget and the intro row
 * its `TournamentBracketIntro`, both of which already read the bracket as nested lists with a
 * per-match accessible name. This route adds the frame the admin area needs (its own route
 * base, actions and tab strip) and the panel heading.
 */
export function AdminTournamentBracketPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const tournament = findAdminTournament(id);

  if (!tournament) return <AdminTournamentNotFound />;

  const intro = bracketIntroByType[tournament.detail.type];

  return (
    <AdminTournamentShell activeTab="llaves" tournament={tournament}>
      <TournamentPanelHeader eyebrow={intro.eyebrow}>{intro.title}</TournamentPanelHeader>
      <TournamentBracketIntro status={intro.status}>{intro.text}</TournamentBracketIntro>
      <TournamentBracket rounds={tournament.detail.bracketRounds} />
    </AdminTournamentShell>
  );
}
