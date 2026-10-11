import { Link } from "@tanstack/react-router";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { Card, CardBody, CardHeader } from "../../components/primitives/Card";
import { Chip } from "../../components/primitives/Chip";
import { LivePill } from "../../components/primitives/LivePill";
import { Num } from "../../components/primitives/Num";
import { PageHeader } from "../../components/primitives/PageHeader";
import { StatePill, type MatchStatus as PillStatus } from "../../components/primitives/StatePill";
import { StateBoundary } from "../../components/states/StateBoundary";
import { PUBLIC_DASHBOARD, type MatchStatus as FixtureMatchStatus } from "../../fixtures";

/**
 * The fixture's match status and the design's pill states are different vocabularies.
 * The fixture distinguishes a scheduled match that is already confirmed today ("today"),
 * which the design's visual language does not have — the design's `.state-pill` set is
 * programado / en vivo / finalizado (frontend/design/html/voleytrack.css:84-87) — so both
 * scheduled states render the design's "Programado" treatment instead of a fourth pill.
 */
const pillStatusByFixtureStatus: Record<FixtureMatchStatus, PillStatus> = {
  live: "envivo",
  today: "programado",
  upcoming: "programado",
  finished: "finalizado",
};

/**
 * The design's team marks are single initials (`.team-logo`, "U"/"B",
 * frontend/design/html/voleytrack-dashboard.html:53-54), so the mark is derived from the
 * team name rather than stored as a second source of truth in the fixtures.
 */
function teamMark(teamName: string) {
  return teamName.trim().slice(0, 1).toUpperCase();
}

/** The design's "Local · 2 sets" / "Visitante · 1 set" pluralisation (dashboard.html:53). */
function setsLabel(sets: number) {
  return `${sets} ${sets === 1 ? "set" : "sets"}`;
}

export function DashboardPage() {
  const { featured } = PUBLIC_DASHBOARD.live;
  const { awaySetsWon, bestOf, clockLabel, homeSetsWon, match, refereeName, tournamentName } =
    featured;
  const highlights = PUBLIC_DASHBOARD.upcoming.slice(0, 2);
  const setsPlayed = homeSetsWon + awaySetsWon;

  return (
    <StateBoundary>
      <div className="mx-auto w-full max-w-[1104px]" data-testid="dashboard-content">
        {/*
         * Design: frontend/design/html/voleytrack.css:65-67 and
         * voleytrack-dashboard.html:44-46 — `.page-head{margin-bottom:22px}` above an h1
         * "Dashboard espectador" and the single description line.
         */}
        <PageHeader
          className="mb-[22px]"
          description="Vista pública principal — partido en vivo y próximos encuentros."
          title="Dashboard espectador"
        />

        {/*
         * Design: frontend/design/html/voleytrack.css:79
         * `.live-grid{display:grid;grid-template-columns:1.6fr .9fr;gap:16px;margin-bottom:16px}`
         * collapsing to a single column below 1100px (voleytrack-dashboard.css:3).
         */}
        <div
          className="mb-4 grid grid-cols-1 gap-4 min-[1100px]:grid-cols-[1.6fr_0.9fr]"
          data-testid="dashboard-live-grid"
        >
          {/*
           * Design: frontend/design/html/voleytrack-dashboard.css:4-5 (`.match-live` and its
           * `::before`) — a 16px radius, the --border hairline, `padding:20px`, and two
           * background layers: a radial accent glow over a
           * linear-gradient(180deg, --surface-2, --surface) fill. Both layers are one
           * background-image so the glow sits exactly where the design's pseudo-element puts
           * it. The card is the structural form (`padded={false}`), so its spacing comes from
           * `CardBody` — the design system's own `.card-b` at 18px 20px (voleytrack.css:78),
           * which is 2px tighter vertically than this card's one-off `padding:20px`.
           */}
          <Card
            className="bg-[radial-gradient(520px_220px_at_80%_0%,var(--color-vt-accent-soft),transparent_60%),linear-gradient(180deg,var(--color-vt-surface-2),var(--color-vt-surface))]"
            data-testid="dashboard-live-featured"
            padded={false}
          >
            <CardBody data-testid="dashboard-live-card-body">
              {/* Design: dashboard.html:51 — live pill, venue-and-competition chip, and a
                  mono clock-and-referee line pushed to the right edge. */}
              <div className="flex flex-wrap items-center gap-2.5">
                <LivePill label={`EN VIVO · SET ${featured.visualSnapshot.setNumber}`} />
                <Chip>
                  {match.venue} · {tournamentName}
                </Chip>
                <Num className="ml-auto text-[11px] text-vt-muted">
                  {clockLabel} · Árbitro: {refereeName}
                </Num>
              </div>

              {/* Design: dashboard.html:52-55 — `.teams{grid-template-columns:1fr auto 1fr;
                  gap:16px}`, each side a 48px/14px mark, a 15px bold name and an 11px
                  uppercase role line, with the set score between them. */}
              <div className="mt-[18px] grid grid-cols-[1fr_auto_1fr] items-center gap-4">
                <div className="text-center">
                  <span
                    aria-hidden="true"
                    className="mx-auto mb-2 grid size-12 place-items-center rounded-[14px] bg-vt-blue text-[15px] font-black text-vt-text"
                  >
                    {teamMark(match.homeTeamName)}
                  </span>
                  <p className="text-[15px] font-bold tracking-[-0.01em]">{match.homeTeamName}</p>
                  <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-vt-muted">
                    Local · {setsLabel(homeSetsWon)}
                  </p>
                </div>

                <div className="text-center">
                  <p>
                    <Num className="text-[36px] font-extrabold tracking-[-0.02em]">
                      {homeSetsWon} <small className="text-[13px] font-bold text-vt-muted">:</small>{" "}
                      {awaySetsWon}
                    </Num>
                  </p>
                  <p>
                    <Num className="text-[11px] uppercase tracking-[0.08em] text-vt-muted">
                      al mejor de {bestOf}
                    </Num>
                  </p>
                  <p className="mt-1.5">
                    <Num className="text-[12px] font-extrabold">
                      {match.score.home} <span className="text-vt-muted">—</span> {match.score.away}
                    </Num>
                  </p>
                </div>

                <div className="text-center">
                  <span
                    aria-hidden="true"
                    className="mx-auto mb-2 grid size-12 place-items-center rounded-[14px] bg-vt-accent text-[15px] font-black text-vt-background"
                  >
                    {teamMark(match.awayTeamName)}
                  </span>
                  <p className="text-[15px] font-bold tracking-[-0.01em]">{match.awayTeamName}</p>
                  <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-vt-muted">
                    Visitante · {setsLabel(awaySetsWon)}
                  </p>
                </div>
              </div>

              {/* Design: voleytrack.css:80-81 (`.progress`) — a 4px --border-2 rail with an
                  accent fill. Decorative: the set score it summarises is already text, so it
                  is hidden from assistive tech rather than announced twice. */}
              <div
                aria-hidden="true"
                className="mt-4 h-1 overflow-hidden rounded-full bg-vt-border-2"
              >
                <div
                  className="h-full rounded-full bg-vt-accent"
                  style={{ width: `${Math.round((setsPlayed / bestOf) * 100)}%` }}
                />
              </div>

              {/* Design: dashboard.html:62-63 — a right-aligned `.btn.accent` call to action. */}
              <div className="mt-3.5 flex justify-end">
                <Link className={buttonClasses("primary")} to={`/matches/${match.id}/live` as string}>
                  Ver partido en vivo →
                </Link>
              </div>
            </CardBody>
          </Card>

          {/*
           * Design: dashboard.html:64-67 — a `.card` with `.card-h` "Próximos destacados"
           * and a mono "HOY" eyebrow, two highlighted fixtures, then a full-width dashed
           * ghost button to the matches list.
           */}
          <Card data-testid="dashboard-highlights" padded={false}>
            <CardHeader>
              Próximos destacados
              <small>HOY</small>
            </CardHeader>
            <CardBody className="flex flex-col gap-2.5" data-testid="dashboard-highlights-card-body">
              {highlights.map(({ match: upcomingMatch }) => (
                <div
                  className="flex items-center gap-3 rounded-xl border border-vt-border-2 bg-vt-background p-2.5"
                  data-testid="dashboard-highlight"
                  key={upcomingMatch.id}
                >
                  <span
                    aria-hidden="true"
                    className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-vt-blue text-[13px] font-black text-vt-text"
                  >
                    {teamMark(upcomingMatch.homeTeamName)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold">
                      {upcomingMatch.homeTeamName} vs {upcomingMatch.awayTeamName}
                    </p>
                    {/*
                     * Design: dashboard.html:57 and :62 — this line carries no font-family
                     * declaration of its own (unlike `.rm-time` in the list below), so it
                     * inherits Inter at 11px in --muted.
                     */}
                    <p className="text-[11px] text-vt-muted">
                      {upcomingMatch.scheduledLabel} · {upcomingMatch.venue}
                    </p>
                  </div>
                </div>
              ))}
              {/*
               * The design's button reads "Ver los 16 partidos →" (dashboard.html:67), a count
               * from the prototype's own dataset; this app's fixtures hold ten matches, so the
               * number is deliberately not printed. Put it back the moment a real matches
               * total exists — until then a false count is worse than diverging from the
               * wording.
               */}
              <Link
                className={buttonClasses("ghost", "md", "w-full justify-center border-dashed")}
                to="/matches"
              >
                Ver todos los partidos →
              </Link>
            </CardBody>
          </Card>
        </div>

        {/*
         * Design: dashboard.html:70-78 — `.upcoming` is the same surface as `.card`, with an
         * `.upcoming-head` row (16px 20px, --border-2 underline) over `.row-match` rows of
         * `140px 1fr 160px 170px 100px` at a 12px gap and 14px 20px padding.
         */}
        <section aria-labelledby="upcoming-matches-heading">
          <Card data-testid="dashboard-upcoming" padded={false}>
            <div className="flex items-center justify-between gap-3 border-b border-vt-border-2 px-5 py-4">
              <h2
                className="text-[14px] font-extrabold tracking-[-0.01em]"
                id="upcoming-matches-heading"
              >
                Próximos partidos
              </h2>
              <Link className={buttonClasses("surface", "sm")} to="/matches">
                Ver todos
              </Link>
            </div>
            <ul>
              {PUBLIC_DASHBOARD.upcoming.map(({ match: upcomingMatch, tournamentName: upcomingTournament }) => (
                <li
                  className="grid grid-cols-2 items-center gap-2 border-b border-vt-border-2 px-5 py-3.5 text-[13px] last:border-b-0 min-[980px]:grid-cols-[140px_1fr_160px_170px_100px] min-[980px]:gap-3"
                  data-testid="dashboard-upcoming-row"
                  key={upcomingMatch.id}
                >
                  <p>
                    <Num className="text-[11px] font-extrabold uppercase tracking-[0.06em] text-vt-muted">
                      {upcomingMatch.scheduledLabel}
                    </Num>
                  </p>
                  <Link
                    className="font-extrabold tracking-[-0.01em] hover:text-vt-accent hover:underline"
                    to={`/matches/${upcomingMatch.id}/live` as string}
                  >
                    {upcomingMatch.homeTeamName} vs {upcomingMatch.awayTeamName}
                  </Link>
                  <span className="text-[12px] text-vt-muted">{upcomingTournament}</span>
                  <span className="text-[12px] text-vt-muted">{upcomingMatch.venue}</span>
                  <span className="min-[980px]:text-right">
                    <StatePill status={pillStatusByFixtureStatus[upcomingMatch.status]} />
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </div>
    </StateBoundary>
  );
}
