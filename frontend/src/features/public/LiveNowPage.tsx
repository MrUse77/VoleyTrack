import { Link } from "@tanstack/react-router";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { Card, CardBody } from "../../components/primitives/Card";
import { PageHeader } from "../../components/primitives/PageHeader";
import { StateBoundary } from "../../components/states/StateBoundary";
import { PUBLIC_LIVE_MATCH_DETAILS } from "../../fixtures";
import { LiveMatchPresentation } from "./LiveMatchPresentation";

/**
 * The public shell's `En vivo` destination.
 *
 * The design's own live page renders inside the public shell — frontend/design/html/
 * voleytrack-live.html carries the same `sidebar-public-nav` group as every other public
 * screen, and its `.page-head` is the shell's page head — so the design places live
 * *inside* the navigation rather than in a chrome-less page. `/matches/$id/live` keeps the
 * app's deliberate focused, standalone treatment for one match; this route is where the
 * nav entry can land without removing the nav the user just clicked.
 *
 * The projection has no clock, so the match that is live right now is the first entry of
 * the live projection (the fixture list is already in feed order).
 */
export function LiveNowPage() {
  const detail = PUBLIC_LIVE_MATCH_DETAILS.at(0);

  return (
    <StateBoundary>
      <div className="mx-auto w-full max-w-[1104px]" data-testid="live-now-content">
        {detail ? (
          <>
            <PageHeader
              actions={
                <Link className={buttonClasses("surface")} to="/matches">
                  ← Volver
                </Link>
              }
              className="mb-[22px]"
              description={`${detail.tournamentName} · ${detail.match.venue}`}
              title={`En vivo — ${detail.match.homeTeamName} vs ${detail.match.awayTeamName}`}
            />
            <LiveMatchPresentation detail={detail} />
          </>
        ) : (
          <>
            <PageHeader
              className="mb-[22px]"
              description="Vista pública del partido en directo."
              title="En vivo"
            />
            <Card padded={false}>
              <CardBody>
                <p className="text-[13px] text-vt-muted">
                  No hay ningún partido en vivo en este momento.
                </p>
                <div className="mt-4">
                  <Link className={buttonClasses("surface")} to="/matches">
                    Ver todos los partidos
                  </Link>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </div>
    </StateBoundary>
  );
}
