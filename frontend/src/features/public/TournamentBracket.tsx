import type { ReactNode } from "react";
import { NavigationLink as Link } from "../../components/navigation/NavigationLink";
import { Badge } from "../../components/primitives/Badge";
import { Num } from "../../components/primitives/Num";
import type { TournamentBracketMatchFixture, TournamentBracketRoundFixture } from "../../fixtures";

/**
 * The bracket widget.
 *
 * Design: frontend/design/html/voleytrack-torneos.css:62-86 and the `bracket()` helper in
 * voleytrack-torneos.html — a horizontally scrollable `.bracket-scroll` (18px padding,
 * `overscroll-behavior-inline:contain`, `tabindex="0"` and an aria-label telling the reader
 * to scroll sideways), holding a `.bracket` grid of 230px round columns with a 28px gap;
 * each `.bracket-round` is a flex column of `.bracket-match` cards (min-height 82px, 9px 10px
 * 8px padding, a 1px --border edge, a 3px --accent left edge, a 10px radius and a --surface-2
 * fill) whose first line is a mono 9px/800 uppercase label and whose two team lines are
 * separated by a 1px --border rule; the final carries `.bracket-match--final` (accent edge
 * and accent-soft fill) and rounds two and three stagger their later matches by 8px and 16px.
 *
 * It is built from utilities and the shared primitives rather than a section stylesheet, and
 * it is a real nested list rather than a diagram: `<ol>` of rounds, an `<h3>` naming each
 * round, and an `<ol>` of matches in each. Every match carries an `aria-label` built from its
 * label, both teams, both scores and its state word, so a screen reader reads "Llave 4:
 * Rosario Central 2 — San Jorge 1, En vivo" instead of two bare names.
 */
const pendingNamePattern = /^(por definir|ganador|clasificado)/i;

const statusWordByMatchStatus: Record<TournamentBracketMatchFixture["status"], string> = {
  played: "Finalizado",
  live: "En vivo",
  upcoming: "Pendiente",
};

function isPlaceholder(name: string): boolean {
  return pendingNamePattern.test(name.trim());
}

function matchAriaLabel(match: TournamentBracketMatchFixture): string {
  const home = match.homeScore === null ? match.homeTeamName : `${match.homeTeamName} ${match.homeScore}`;
  const away = match.awayScore === null ? match.awayTeamName : `${match.awayTeamName} ${match.awayScore}`;

  return `${match.displayId.toUpperCase()}: ${home} — ${away}, ${statusWordByMatchStatus[match.status]}`;
}

function TeamLine({
  id,
  name,
  score,
}: {
  id?: string;
  name: string;
  score: number | null;
}) {
  const placeholder = isPlaceholder(name);
  const nameClasses = placeholder
    ? "font-semibold text-vt-muted"
    : "font-bold text-vt-text";

  return (
    <span className={`block truncate px-0.5 py-[3px] text-[12px] ${nameClasses}`}>
      {id ? (
        <Link className="hover:underline" to={`/teams/${id}` as string}>
          {name}
        </Link>
      ) : (
        name
      )}
      {/* Design: the prototype's bracket lines hold a team name only. The fixture also holds
          the played score, so it is appended rather than dropped — it is data the app has,
          and a played match is then distinguishable from a pending one without colour. */}
      {score === null ? null : (
        <>
          {" "}
          <Num className="text-[12px]">{score}</Num>
        </>
      )}
    </span>
  );
}

/** Design: `.bracket-intro` + `.bracket-status` (voleytrack-torneos.css:56-59). */
export function TournamentBracketIntro({ status, children }: { status: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-vt-border-2 bg-vt-background px-[18px] py-[14px] max-[600px]:flex-col max-[600px]:items-start max-[600px]:gap-2">
      {/* The design's `.bracket-status` paints #ffd0ad ink, which has no token in this app;
          `Badge`'s accent variant is the existing accent-soft pill, so no raw colour enters. */}
      <Badge className="shrink-0" variant="accent">
        {status}
      </Badge>
      <p className="text-[12px] text-vt-muted">{children}</p>
    </div>
  );
}

export function TournamentBracket({ rounds }: { rounds: readonly TournamentBracketRoundFixture[] }) {
  // Design: `.bracket--four-rounds` / `.bracket--three-rounds` are the only two column sets
  // the design defines; both are written out so Tailwind emits them as static utilities.
  const columns = rounds.length >= 4 ? "grid-cols-[repeat(4,230px)]" : "grid-cols-[repeat(3,230px)]";

  return (
    <div
      aria-label="Llaves del torneo. Desplazá horizontalmente para ver todas las rondas."
      className="w-full max-w-full min-w-0 overflow-x-auto overscroll-x-contain p-[18px] focus-visible:-outline-offset-2 focus-visible:outline-2 focus-visible:outline-vt-accent"
      data-testid="tournament-bracket"
      role="region"
      tabIndex={0}
    >
      <ol className={`grid w-max min-w-full items-start gap-7 ${columns}`}>
        {rounds.map((round, roundIndex) => (
          <li className="flex min-w-[230px] flex-col gap-3" key={round.round}>
            <h3 className="mb-1 h-5 font-mono text-[11px] font-extrabold tracking-[0.08em] text-vt-muted uppercase">
              {round.round}
            </h3>
            <ol
              className={`flex flex-col gap-3 ${
                roundIndex === 1 ? "[&>li+li]:mt-2" : roundIndex === 2 ? "[&>li+li]:mt-4" : ""
              }`.trim()}
            >
              {round.matches.map((match) => {
                // Design: `.bracket-match--final` is on the LAST round's match (the design
                // marks the `Final` round's single card), not on every round whose name
                // contains "final" — "Cuartos de final" and "Semifinal" would both match a
                // name test.
                const isFinal = roundIndex === rounds.length - 1;
                const surface = isFinal
                  ? "border-vt-accent/55 bg-vt-accent-soft"
                  : "border-vt-border bg-vt-surface-2";

                return (
                  <li
                    aria-label={matchAriaLabel(match)}
                    className={`min-h-[82px] rounded-[10px] border border-l-[3px] border-l-vt-accent px-[10px] pt-[9px] pb-2 [&>span+span]:border-t [&>span+span]:border-vt-border ${surface}`}
                    data-bracket-match={match.displayId}
                    key={match.displayId}
                  >
                    <small className="mb-[5px] block font-mono text-[9px] font-extrabold tracking-[0.06em] text-vt-muted-2 uppercase">
                      {/* The design's `.bracket-match small` is a plain label. The fixture
                          also holds the match identity for four of the seven brackets, so
                          that identity stays a link to the live detail instead of being
                          dropped — the design's own destination for a match. */}
                      {match.matchId ? (
                        <Link className="hover:underline" to={`/matches/${match.matchId}/live` as string}>
                          {match.displayId.toUpperCase()}
                        </Link>
                      ) : (
                        match.displayId.toUpperCase()
                      )}
                    </small>
                    <TeamLine id={match.homeTeamId} name={match.homeTeamName} score={match.homeScore} />
                    <TeamLine id={match.awayTeamId} name={match.awayTeamName} score={match.awayScore} />
                  </li>
                );
              })}
            </ol>
          </li>
        ))}
      </ol>
    </div>
  );
}
