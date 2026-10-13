import type { ReactNode } from "react";
import { NavigationLink as Link } from "../../components/navigation/NavigationLink";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { Card, CardBody, CardHeader } from "../../components/primitives/Card";
import { InfoRow } from "../../components/primitives/InfoRow";
import type { AdminTournamentFixture } from "../../fixtures";
import { TournamentDetailShell } from "../public/TournamentDetailShell";

/**
 * The admin tournament detail's frame: the shared `TournamentDetailShell` with the admin
 * side's own page-head actions, route base and side panel.
 *
 * Design: frontend/design/html/voleytrack-admin-ver-torneo.html and
 * voleytrack-admin-ver-copa.html. Both admin details render the same regions the public
 * detail does — `.page-head` with the name, a status badge and the `Volver` / `Editar torneo`
 * (`btn`) / `Crear partido` (`btn accent`) actions, the `.kpi-grid`, the `Información` card
 * and the `.tournament-tabs` strip — over the same tournament data, so the frame is reused
 * instead of copied. Only the cup detail adds a second `.card` (`Formato`) beside
 * `Información` inside the design's `.detail-grid`, which is the `sidePanel` slot.
 *
 * The route base is `/admin/tournaments` rather than `/tournaments`, so the tab strip points
 * at the admin routes; `tournamentTabs` is the one tab set both areas share, so the two
 * screens cannot drift apart on a label.
 */
export function AdminTournamentShell({
  activeTab,
  children,
  tournament,
}: {
  activeTab: string;
  children: ReactNode;
  tournament: AdminTournamentFixture;
}) {
  const { detail } = tournament;
  // Design: the cup detail's `Formato` card lists one row per round with the number of teams
  // that enter it, and `Partido único` for the closing round
  // (voleytrack-admin-ver-copa.html). Both figures are derived from the fixture's own bracket
  // rounds rather than written out: each match has two sides, and the last round is a single
  // match.
  const formatCard = (
    <Card padded={false}>
      <CardHeader>
        Formato
        <small>RONDAS</small>
      </CardHeader>
      <CardBody data-testid="tournament-format-card-body">
        {detail.bracketRounds.map((round, index) => (
          <InfoRow
            key={round.round}
            label={round.round}
            value={
              index === detail.bracketRounds.length - 1
                ? "Partido único"
                : `${round.matches.length * 2} equipos`
            }
          />
        ))}
      </CardBody>
    </Card>
  );

  return (
    <TournamentDetailShell
      activeTab={activeTab}
      actions={
        <>
          <Link
            className={buttonClasses("surface")}
            to={`/admin/tournaments/${tournament.id}/edit` as string}
          >
            Editar torneo
          </Link>
          {/*
            Design: `<a class="btn accent" href="voleytrack-admin-crear-partido.html?torneo=…">`
            (voleytrack-admin-ver-torneo.html). The app's create-match route declares no search
            parameter and its screen reads none, so the CTA carries no `?torneo=` value here:
            a parameter nothing consumes would be a link that pretends to pass context.
          */}
          <Link className={buttonClasses("primary")} to={"/admin/matches/create" as string}>
            Crear partido
          </Link>
        </>
      }
      backTo="/admin/tournaments"
      basePath="/admin/tournaments"
      sidePanel={detail.type === "Copa" ? formatCard : undefined}
      tournament={detail}
    >
      {children}
    </TournamentDetailShell>
  );
}
