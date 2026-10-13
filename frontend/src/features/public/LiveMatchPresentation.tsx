import { NavigationLink as Link } from "../../components/navigation/NavigationLink";
import { Avatar } from "../../components/primitives/Avatar";
import { Badge } from "../../components/primitives/Badge";
import { Card, CardBody, CardHeader } from "../../components/primitives/Card";
import { Chip } from "../../components/primitives/Chip";
import { InfoRow } from "../../components/primitives/InfoRow";
import { LivePill } from "../../components/primitives/LivePill";
import { Num } from "../../components/primitives/Num";
import type {
  LiveMatchDetailFixture,
  LiveTeamRosterFixture,
  LiveTeamRotationFixture,
  MatchFixture,
} from "../../fixtures";

/**
 * The live presentation, shared by the two routes that show it:
 *
 * - `/matches/$id/live` (a focused, standalone view of one match) and
 * - `/live` (the public shell's `En vivo` destination, which resolves the match that is
 *   live right now).
 *
 * Every region below is transcribed from
 * frontend/design/html/voleytrack-live.html + voleytrack-live.css. Inline `style="…"` in
 * that file is prototype shorthand; each one is translated into primitives and utilities
 * and the design line is cited next to the translated region.
 */

/** The design's `.set-result-score`, `.stat-value` and `.roster-stat` target a 25-point set. */
const SET_TARGET = 25;

/** The design's team marks are single initials (`.logo-mark` region of the scoreboard). */
function teamMark(teamName: string) {
  return teamName.trim().slice(0, 1).toUpperCase();
}

/** The design's court chips print the surname only ("4 · FERNÁNDEZ #7"). */
function surname(playerName: string) {
  const tokens = playerName.trim().split(/\s+/);
  return (tokens.at(-1) ?? playerName).toUpperCase();
}

/**
 * The design's court/scorer discs are player photos. The fixtures carry no photo, so the
 * shared identity disc carries the shirt number when the projection knows it and the
 * player's initials when it does not; the printed name is always adjacent.
 */
function playerInitials(playerName: string) {
  const tokens = playerName.trim().split(/\s+/).filter(Boolean);
  const first = tokens.at(0) ?? "";
  const last = tokens.length > 1 ? tokens.at(-1) ?? "" : "";
  return `${first.slice(0, 1)}${last.slice(0, 1)}`.toUpperCase() || "?";
}

/**
 * The design's "Top anotadores" rows print a shirt number next to the name
 * ("./voleytrack-live.html", the `.scorer-name` cells). The leaders projection has no
 * number of its own, but the same six players' numbers are already published by the
 * match's rotation, so the number is read from there instead of being invented a second
 * time. A leader who is not in the published rotation falls back to name initials.
 */
function shirtNumberFor(
  detail: LiveMatchDetailFixture,
  teamId: string,
  playerName: string,
): number | undefined {
  const rotation = detail.rotations.find((entry) => entry.teamId === teamId);
  return rotation?.positions.find((entry) => entry.playerName === playerName)?.number;
}

/**
 * The design's `.scoreboard` (voleytrack-live.css:3) is `1fr auto 1fr` with a 20px gap and
 * a two-tone fill. Its `#1a2740` top stop is a raw literal with no counterpart in the
 * vendored palette (voleytrack.css:7-19 defines --bg, --surface, --surface-2 only), so the
 * fill uses the design system's own two-layer surface gradient — the exact pair the
 * dashboard's featured live card already paints (--surface-2 over --surface).
 */
function LiveScoreboard({ detail }: { detail: LiveMatchDetailFixture }) {
  const { match } = detail;
  const currentSet = detail.sets.at(-1)!;
  const homeServes = detail.servingTeamId === match.homeTeamId;
  const servingTeamName = homeServes ? match.homeTeamName : match.awayTeamName;
  const leadingScore = Math.max(detail.currentScore.home, detail.currentScore.away);
  const setProgress = Math.min(100, Math.round((leadingScore / SET_TARGET) * 100));
  const setsLabel = (sets: number) => `${sets} ${sets === 1 ? "set" : "sets"}`;

  return (
    <section
      aria-labelledby="live-scoreboard-heading"
      className="grid grid-cols-1 items-center gap-5 rounded-2xl border border-vt-border bg-gradient-to-b from-vt-surface-2 to-vt-surface p-[22px] min-[720px]:grid-cols-[1fr_auto_1fr]"
      data-testid="live-match-scoreboard"
    >
      <h2 className="sr-only" id="live-scoreboard-heading">
        Marcador del partido en vivo
      </h2>

      <div className="text-center">
        <span
          aria-hidden="true"
          className="mx-auto grid size-14 place-items-center rounded-[14px] bg-vt-blue text-[17px] font-black text-vt-text"
        >
          {teamMark(match.homeTeamName)}
        </span>
        <Link
          className="mt-2 block font-bold tracking-[-0.01em] hover:text-vt-accent hover:underline"
          to={`/teams/${match.homeTeamId}` as string}
        >
          {match.homeTeamName}
        </Link>
        <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-vt-muted">
          Local{homeServes ? " · Saque" : ""}
        </p>
      </div>

      {/*
       * A score that changes is the one thing on this screen that must be announced, so this
       * is the screen's only live region: `role="status"` (which carries an implicit
       * `aria-live="polite"` and `aria-atomic="true"`, both restated here because this region
       * already set them) around the sets score and the current set score. The two `LivePill`s
       * elsewhere on the screen are plain labels now - a static pill is not a live region, and
       * three competing ones made the one that matters harder to follow. The painted digits
       * are replaced for assistive tech by the full sentence above them, so "2 : 1" is never
       * read as bare punctuation.
       */}
      <div
        aria-atomic="true"
        aria-live="polite"
        className="text-center"
        data-testid="live-score-region"
        role="status"
      >
        <p className="sr-only">
          {`${match.homeTeamName} ${setsLabel(detail.homeSetsWon)}, ${match.awayTeamName} ${setsLabel(
            detail.awaySetsWon,
          )}. Set ${currentSet.number}: ${detail.currentScore.home} a ${detail.currentScore.away}. Saca ${
            servingTeamName
          }.`}
        </p>
        <p aria-hidden="true">
          <Num className="text-[42px] font-black leading-none tracking-[-0.04em]">
            {detail.homeSetsWon} <small className="text-[13px] font-bold text-vt-muted">:</small>{" "}
            {detail.awaySetsWon}
          </Num>
        </p>
        <p aria-hidden="true" className="mt-1" data-testid="live-set-score">
          <Num className="text-[13px] font-bold text-vt-muted">
            SET {currentSet.number} ·{" "}
            <span data-testid="current-score-home">{detail.currentScore.home}</span>-
            <span data-testid="current-score-away">{detail.currentScore.away}</span>
          </Num>
        </p>
        {/*
         * The design's `.progress` (voleytrack.css:80-81) is a 4px --border-2 rail with an
         * accent fill. Decorative: the set score it summarises is already announced by the
         * region above, so it is hidden from assistive tech rather than read twice.
         */}
        <div aria-hidden="true" className="mx-auto mt-2.5 h-1 w-[220px] overflow-hidden rounded-full bg-vt-border-2">
          <span className="block h-full rounded-full bg-vt-accent" style={{ width: `${setProgress}%` }} />
        </div>
      </div>

      <div className="text-center">
        <span
          aria-hidden="true"
          className="mx-auto grid size-14 place-items-center rounded-[14px] bg-vt-accent text-[17px] font-black text-vt-background"
        >
          {teamMark(match.awayTeamName)}
        </span>
        <Link
          className="mt-2 block font-bold tracking-[-0.01em] hover:text-vt-accent hover:underline"
          to={`/teams/${match.awayTeamId}` as string}
        >
          {match.awayTeamName}
        </Link>
        <p className="mt-0.5 text-[11px] font-bold uppercase tracking-[0.06em] text-vt-muted">
          Visitante{homeServes ? "" : " · Saque"}
        </p>
      </div>
    </section>
  );
}

/**
 * The design's `.set-history-card` (voleytrack-live.css:35-42): a --surface surface with a
 * `.set-history-head` row (title, matchup line and the "SET n EN VIVO" live pill) over a
 * three-column `.set-history-grid` of `.set-result` tiles. The tile's own padding is a
 * one-off `padding:16px 18px`; this card uses the structural Card, so its spacing comes
 * from the shared `.card-h`/`.card-b` rhythm (voleytrack.css:76-78) instead.
 */
function SetHistory({ detail }: { detail: LiveMatchDetailFixture }) {
  const { match } = detail;
  const currentSet = detail.sets.at(-1)!;

  return (
    <Card className="mt-4" data-testid="set-history-card" padded={false}>
      <CardHeader>
        <div className="min-w-0">
          <h2 className="text-[14px] font-extrabold tracking-[-0.01em]">Historial de sets</h2>
          <p className="mt-[3px] text-[11px] text-vt-muted" id="live-matchup">
            Resultado del partido · {match.homeTeamName} vs {match.awayTeamName}
          </p>
        </div>
        <LivePill className="shrink-0" label={`SET ${currentSet.number} EN VIVO`} />
      </CardHeader>
      <ul
        className="grid grid-cols-1 gap-2.5 px-5 pb-[18px] pt-3 min-[720px]:grid-cols-3"
        data-testid="set-history-grid"
      >
        {detail.sets.map((set) => {
          const isCurrent = set.status === "current";

          return (
            <li
              className={`rounded-xl border bg-vt-background p-3 ${
                isCurrent ? "border-vt-accent/50 bg-vt-accent/10" : "border-vt-border-2"
              }`}
              data-testid="set-history-item"
              key={set.number}
            >
              <p className="flex items-center justify-between gap-2 font-mono text-[10px] font-extrabold uppercase tracking-[0.05em] text-vt-muted">
                <span>Set {set.number}</span>
                {/*
                 * The design colours the tile's status (--success when finished, --accent
                 * when live) but never states it in words alone; the two words differ, so the
                 * state survives without colour.
                 */}
                <span className={isCurrent ? "text-vt-accent" : "text-vt-success"}>
                  {isCurrent ? "En vivo" : "Finalizado"}
                </span>
              </p>
              <Num className="mt-2 inline-flex items-baseline gap-2 text-[20px] font-black">
                {set.home} <small className="text-[10px] font-bold text-vt-muted">—</small> {set.away}
              </Num>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/** Home positions: the three attackers in front of the 3m line, the three defenders behind it. */
const homeCourtCells = [
  "left-[40%] top-[20%]",
  "left-[40%] top-[50%]",
  "left-[40%] top-[80%]",
  "left-[18%] top-[20%]",
  "left-[18%] top-[50%]",
  "left-[18%] top-[80%]",
] as const;

/** The away side is the design's mirror of the home side. */
const awayCourtCells = [
  "right-[40%] top-[20%]",
  "right-[40%] top-[50%]",
  "right-[40%] top-[80%]",
  "right-[18%] top-[20%]",
  "right-[18%] top-[50%]",
  "right-[18%] top-[80%]",
] as const;

function CourtSide({ rotation, side }: { rotation: LiveTeamRotationFixture; side: "home" | "away" }) {
  const cells = side === "home" ? homeCourtCells : awayCourtCells;

  return (
    <ol
      aria-label={`${rotation.teamName}, rotación actual`}
      className="contents"
      data-testid="court-position-grid"
    >
      {rotation.positions.map((player, index) => (
        <li
          aria-label={`${rotation.teamName}, posición ${player.position}: ${player.playerName}, número ${player.number}`}
          className={`absolute flex -translate-y-1/2 flex-col items-center gap-1 ${cells[index]}`}
          data-position={player.position}
          data-testid="court-position"
          key={player.position}
        >
          {/*
           * Team identity on the court is carried by the ring tone, the side of the net and
           * the team badges under the court, and it is restated in words by this item's
           * accessible name — never by colour alone.
           */}
          <Avatar
            className={`ring-2 ${side === "home" ? "ring-vt-blue" : "ring-vt-accent"}`}
            initials={player.number}
          />
          <span className="whitespace-nowrap rounded-full bg-vt-background/80 px-[5px] py-0.5 text-[8px] font-extrabold text-vt-text">
            {player.position} · {surname(player.playerName)} #{player.number}
          </span>
        </li>
      ))}
    </ol>
  );
}

/**
 * The design's court card (`data-od-id="cancha-voley"`, voleytrack-live.html): a card whose
 * `.card-h` names the matchup, over a `position:relative` --surface-2 box at
 * `aspect-ratio:18/9` holding the perimeter, the central net, the two 3m attack lines and
 * twelve positioned players, then a row of badges. Every inline `style` in that block is
 * translated here: `rgba(226,232,240,.65)` is the vendored `--label` tone (#e2e8f0,
 * tokens.css) at 65%, `rgba(226,232,240,.45)` the same tone at 45%, `rgba(0,0,0,.78)` is
 * the canvas fill at 80%, and the net's accent glow reuses `--accent-soft`.
 */
function CourtBoard({ detail }: { detail: LiveMatchDetailFixture }) {
  const { match } = detail;
  const [homeRotation, awayRotation] = detail.rotations;
  const homeServes = detail.servingTeamId === match.homeTeamId;
  const servingTeam = homeServes ? homeRotation : awayRotation;
  const playerCount = homeRotation.positions.length + awayRotation.positions.length;

  return (
    <Card data-testid="court-rotations" padded={false}>
      <CardHeader>
        <h2 className="text-[14px] font-extrabold tracking-[-0.01em]" id="court-rotations-heading">
          Cancha — {match.homeTeamName} vs {match.awayTeamName}
        </h2>
        <small>{playerCount} jugadores en posición</small>
      </CardHeader>
      <CardBody data-testid="court-card-body">
        <p className="sr-only" id="court-rotations-description">
          {`Cancha dividida por la red central. ${homeRotation.teamName} ocupa la mitad izquierda con tres jugadores delante de la línea de tres metros y tres detrás; ${awayRotation.teamName} ocupa la mitad derecha en espejo. Saca ${servingTeam.teamName}.`}
        </p>
        <div
          aria-describedby="court-rotations-description"
          className="relative aspect-[18/9] overflow-hidden rounded-[14px] border border-vt-border bg-vt-surface-2 p-2.5"
          role="group"
          data-testid="court-graphic"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-2.5 rounded border-2 border-vt-label/65"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-2.5 left-1/2 top-2.5 z-[2] w-[3px] -translate-x-1/2 bg-vt-accent shadow-[0_0_8px_var(--color-vt-accent-soft)]"
            data-testid="volleyball-net"
          />
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-2 z-[3] -translate-x-1/2 rounded-full bg-vt-accent px-1.5 py-0.5 font-mono text-[7px] font-black tracking-[0.08em] text-vt-background"
          >
            RED
          </span>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2.5 left-1/3 top-2.5 w-0.5 -translate-x-1/2 bg-vt-label/45"
            data-testid="attack-line"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2.5 right-1/3 top-2.5 w-0.5 translate-x-1/2 bg-vt-label/45"
            data-testid="attack-line"
          />
          <span
            aria-hidden="true"
            className="absolute left-1/3 top-1.5 -translate-x-1/2 rounded-full bg-vt-label/90 px-1 py-px font-mono text-[6px] font-black tracking-[0.06em] text-vt-background"
          >
            3M
          </span>
          <span
            aria-hidden="true"
            className="absolute right-1/3 top-1.5 translate-x-1/2 rounded-full bg-vt-label/90 px-1 py-px font-mono text-[6px] font-black tracking-[0.06em] text-vt-background"
          >
            3M
          </span>
          <CourtSide rotation={homeRotation} side="home" />
          <CourtSide rotation={awayRotation} side="away" />
        </div>
        <div className="mt-2.5 flex flex-wrap gap-2">
          <Badge variant="ok">{playerCount} jugadores</Badge>
          <Badge>
            {homeRotation.teamName}: 3 delante 3m · 3 detrás
          </Badge>
          <Badge>
            {awayRotation.teamName}: 3 delante 3m · 3 detrás
          </Badge>
          <Chip variant="accent">Saque: {servingTeam.teamName}</Chip>
        </div>
      </CardBody>
    </Card>
  );
}

/**
 * The design's "Eventos en vivo" card: a `.card-h` with the heading and an "AUTO · 2s"
 * pill over a `.timeline` (a 22px-indented rail with a `::before` line at 7px and a
 * 16px-separated `.tl-item` per event: dot, mono time and set, the event sentence and a
 * mono score pushed to the right edge).
 *
 * The design's "Ver historial completo" button is deliberately NOT rendered: it opened a
 * point-by-point history modal fed by the prototype's own generated dataset, and no
 * fixture carries that history — rendering it here would be a control that leads nowhere.
 */
function EventTimeline({ detail }: { detail: LiveMatchDetailFixture }) {
  return (
    <Card className="flex h-full flex-col" data-testid="live-events" padded={false}>
      <CardHeader>
        <h2 className="text-[14px] font-extrabold tracking-[-0.01em]" id="live-events-heading">
          Eventos en vivo
        </h2>
        <LivePill label="AUTO · 2s" />
      </CardHeader>
      <CardBody className="flex flex-1 flex-col" data-testid="live-events-card-body">
        <ol
          className="relative flex-1 list-none pl-[22px] before:absolute before:bottom-1.5 before:left-[7px] before:top-1.5 before:w-0.5 before:rounded-full before:bg-vt-border-2 before:content-['']"
          data-testid="live-event-list"
        >
          {detail.events.map((event, index) => {
            const [setLabel, score] = event.matchContext.split(" · ");
            const isLatest = index === 0;

            return (
              <li
                className="relative mb-4 flex gap-3 last:mb-0"
                data-testid="live-event"
                key={event.id}
              >
                <span
                  aria-hidden="true"
                  className={`absolute -left-[18px] top-1 size-2.5 rounded-full border-2 border-vt-surface ${
                    event.outcome === "error" ? "bg-vt-muted" : "bg-vt-accent"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  {isLatest ? <span className="sr-only">Evento más reciente. </span> : null}
                  <Num className="text-[11px] font-bold text-vt-muted">
                    <time>{event.time}</time> · {setLabel}
                  </Num>
                  <p className="mt-0.5 text-[13px]">
                    <b className="font-extrabold">{event.eventType}</b> — {event.playerName} (
                    {event.teamName})
                  </p>
                </div>
                <Num
                  className={`ml-auto shrink-0 text-[13px] font-extrabold ${
                    isLatest ? "text-vt-accent" : "text-vt-text"
                  }`}
                >
                  {score}
                </Num>
              </li>
            );
          })}
        </ol>
      </CardBody>
    </Card>
  );
}

/**
 * The design's "Estadísticas por equipo" card (`.insight-card`, voleytrack-live.css:8-21):
 * an `.insight-head` with the title, the comparison line and the two team legend dots, over
 * `.stat-row`s of `46px 1fr 46px` holding a mono `.stat-value`, a centred `.stat-label` and
 * a two-track `.stat-track` bar pair.
 */
function TeamStatisticsPanel({ detail }: { detail: LiveMatchDetailFixture }) {
  const { match } = detail;
  const currentSet = detail.sets.at(-1)!;
  const teamNames = { home: match.homeTeamName, away: match.awayTeamName };

  return (
    <Card data-testid="team-statistics" padded={false}>
      <div className="flex items-start justify-between gap-3 px-5 pt-[18px]">
        <div className="min-w-0">
          <h3 className="text-[14px] font-extrabold tracking-[-0.01em]">Estadísticas por equipo</h3>
          <p className="mt-[3px] text-[11px] text-vt-muted">
            Comparativa del partido · Set {currentSet.number}
          </p>
        </div>
        <p className="flex shrink-0 items-center gap-3.5 font-mono text-[10px] font-extrabold uppercase tracking-[0.04em] text-vt-muted">
          <span className="inline-flex items-center gap-1.5">
            <i aria-hidden="true" className="size-[7px] rounded-full bg-vt-blue" />
            {match.homeTeamName}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <i aria-hidden="true" className="size-[7px] rounded-full bg-vt-accent" />
            {match.awayTeamName}
          </span>
        </p>
      </div>
      <ul className="px-5 pb-[18px] pt-4" data-testid="team-stat-rows">
        {detail.teamStats.map((stat) => {
          const total = stat.home + stat.away || 1;
          const homeWidth = Math.round((stat.home / total) * 100);
          const awayWidth = 100 - homeWidth;

          return (
            <li
              className="mt-3.5 grid grid-cols-[46px_1fr_46px] items-center gap-2.5 first:mt-0"
              data-testid="team-stat-row"
              key={stat.label}
            >
              <span className="sr-only">
                {`${stat.label}: ${teamNames.home} ${stat.home}, ${teamNames.away} ${stat.away}`}
              </span>
              <Num aria-hidden="true" className="text-[12px] font-extrabold">
                {stat.home}
              </Num>
              <span aria-hidden="true">
                <span className="block text-center text-[11px] font-bold text-vt-muted">
                  {stat.label}
                </span>
                <span className="mt-[5px] grid h-[7px] grid-cols-2 gap-[3px]">
                  <i
                    className="block min-w-1 rounded-r-full bg-vt-blue"
                    style={{ width: `${homeWidth}%` }}
                  />
                  <i
                    className="block min-w-1 justify-self-end rounded-r-full bg-vt-accent"
                    style={{ width: `${awayWidth}%` }}
                  />
                </span>
              </span>
              <Num aria-hidden="true" className="text-[12px] font-extrabold text-vt-accent">
                {stat.away}
              </Num>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

/**
 * The design's "Top anotadores" card (`.insight-card` + `.scorer-list`): a TOP 3 badge in
 * the accent-soft treatment over a list of `.scorer` rows of `24px 34px 1fr auto` — rank,
 * avatar, name and team, then the mono point total with a 10px "PTS" eyebrow.
 */
function TopScorersPanel({ detail }: { detail: LiveMatchDetailFixture }) {
  return (
    <Card data-testid="top-scorers" padded={false}>
      <div className="flex items-start justify-between gap-3 px-5 pt-[18px]">
        <div className="min-w-0">
          <h3 className="text-[14px] font-extrabold tracking-[-0.01em]">Top anotadores</h3>
          <p className="mt-[3px] text-[11px] text-vt-muted">Puntos acumulados</p>
        </div>
        <Badge className="shrink-0" variant="accent">
          TOP 3
        </Badge>
      </div>
      <ol className="flex flex-col gap-2.5 px-5 pb-[18px] pt-4" data-testid="top-scorers-list">
        {detail.playerLeaders.map((leader, index) => {
          const number = shirtNumberFor(detail, leader.teamId, leader.playerName);
          const isLeader = index === 0;

          return (
            <li
              className={`grid grid-cols-[24px_36px_1fr_auto] items-center gap-2.5 rounded-xl border bg-vt-background p-2.5 ${
                isLeader ? "border-vt-accent/50 bg-vt-accent/10" : "border-vt-border-2"
              }`}
              data-testid="top-scorer"
              key={`${leader.rank}-${leader.playerName}`}
            >
              <Num className="text-center text-[11px] font-extrabold text-vt-muted">
                {String(leader.rank).padStart(2, "0")}
              </Num>
              <Avatar initials={number ?? playerInitials(leader.playerName)} />
              <div className="min-w-0">
                <p className="truncate text-[12px] font-extrabold">
                  {leader.playerName}
                  {number ? ` #${number}` : ""}
                </p>
                <p className="mt-0.5 truncate font-mono text-[10px] text-vt-muted">
                  {leader.teamName}
                </p>
              </div>
              <Num className="text-[16px] font-black">
                {leader.points} <small className="text-[10px] font-bold text-vt-muted">PTS</small>
              </Num>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

/**
 * The design's `.roster-team` card (voleytrack-live.css:44-56): a 2px team-toned top edge,
 * a head row with the team dot and the player count, and one `.roster-player` row per
 * player at `34px 1fr repeat(4,34px)` — identity disc, name + shirt number over the role,
 * then the four `.roster-stat` cells with their own 8px mono labels.
 *
 * The design also prints a column-header row above the players, but every cell below
 * already carries its own PTS/ATA/BLQ/ACE label (`.roster-stat small`), so the header row
 * would only repeat the same four words; it is not rendered.
 */
function RosterPanel({
  roster,
  side,
}: {
  roster: LiveTeamRosterFixture;
  side: "home" | "away";
}) {
  const tone = side === "home" ? "bg-vt-blue" : "bg-vt-accent";

  return (
    <Card
      className={`border-t-2 ${side === "home" ? "border-t-vt-blue" : "border-t-vt-accent"}`}
      data-testid={`roster-${side}`}
      padded={false}
    >
      <div className="flex items-center justify-between gap-3 px-5 pt-[18px]">
        <h3 className="flex items-center gap-2 text-[14px] font-extrabold">
          <i aria-hidden="true" className={`size-2 rounded-full ${tone}`} />
          {roster.teamName}
        </h3>
        <Num className="text-[10px] font-extrabold uppercase tracking-[0.06em] text-vt-muted">
          {roster.players.length} jugadores
        </Num>
      </div>
      <ul
        className="flex flex-col gap-2 px-5 py-[18px]"
        data-testid={`roster-${side}-list`}
      >
        {roster.players.map((player) => (
          <li
            className="grid grid-cols-[36px_1fr_repeat(4,36px)] items-center gap-2 rounded-xl border border-vt-border-2 bg-vt-background p-2"
            data-testid="roster-player"
            key={player.number}
          >
            <Avatar initials={player.number} />
            <div className="min-w-0">
              <p className="truncate text-[12px] leading-tight font-extrabold">
                {player.playerName} #{player.number}
              </p>
              <p className="mt-[3px] font-mono text-[9px] font-bold uppercase text-vt-muted">
                {player.role}
              </p>
            </div>
            <Num className="text-[11px] font-extrabold">
              {player.points}
              <small className="mt-0.5 block text-[8px] font-bold text-vt-muted">PTS</small>
            </Num>
            <Num className="text-[11px] font-extrabold">
              {player.attackPercent}%
              <small className="mt-0.5 block text-[8px] font-bold text-vt-muted">ATA</small>
            </Num>
            <Num className="text-[11px] font-extrabold">
              {player.blocks}
              <small className="mt-0.5 block text-[8px] font-bold text-vt-muted">BLQ</small>
            </Num>
            <Num className="text-[11px] font-extrabold">
              {player.aces}
              <small className="mt-0.5 block text-[8px] font-bold text-vt-muted">ACE</small>
            </Num>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/**
 * The match metadata panel has no counterpart in the live design — it predates this slice
 * and is kept so the screen's existing data flow (tournament, venue, schedule, serving
 * side, identifier) is not removed. Its label/value pairs now render through the shared
 * `InfoRow` instead of the screen's own hand-rolled pair.
 */
export function MatchMetadataPanel({
  match,
  servingTeamName,
  tournamentName,
}: {
  match: MatchFixture;
  servingTeamName?: string;
  tournamentName: string;
}) {
  return (
    <Card className="mt-6" data-testid="match-metadata" padded={false}>
      <CardHeader>
        <h2 className="text-[14px] font-extrabold tracking-[-0.01em]">Información del partido</h2>
      </CardHeader>
      <CardBody>
        <InfoRow label="Torneo" value={tournamentName} />
        <InfoRow label="Estado" value={match.badgeLabel} />
        <InfoRow label="Sede" value={match.venue} />
        <InfoRow label="Horario" value={match.scheduledLabel} />
        {servingTeamName ? <InfoRow label="Saque" value={servingTeamName} /> : null}
        <InfoRow label="Identificador" value={match.id} />
      </CardBody>
    </Card>
  );
}

export function LiveMatchPresentation({ detail }: { detail: LiveMatchDetailFixture }) {
  return (
    <>
      <LiveScoreboard detail={detail} />
      <SetHistory detail={detail} />
      {/*
       * Design: the live page's own `1.15fr .85fr` two-column rows
       * (voleytrack-live.html, the court/events row and the insights row), collapsing to a
       * single column on narrow viewports (voleytrack-live.css:73-75, `@media(max-width:1180px)`).
       */}
      <div
        className="mt-4 grid grid-cols-1 gap-4 min-[1180px]:grid-cols-[1.15fr_0.85fr]"
        data-testid="live-court-grid"
      >
        <CourtBoard detail={detail} />
        <EventTimeline detail={detail} />
      </div>
      <div
        className="mt-4 grid grid-cols-1 gap-4 min-[1180px]:grid-cols-[1.15fr_0.85fr]"
        data-testid="match-insights"
      >
        <TeamStatisticsPanel detail={detail} />
        <TopScorersPanel detail={detail} />
      </div>
      <section
        aria-labelledby="individual-stats-heading"
        className="mt-6 border-t border-vt-border pt-5"
        data-testid="individual-stats"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-[14px] font-extrabold tracking-[-0.01em]" id="individual-stats-heading">
              Estadísticas individuales
            </h2>
            <p className="mt-[3px] text-[11px] text-vt-muted">
              Rendimiento del partido · PTS, ATA, BLQ y ACE
            </p>
          </div>
          <Badge className="shrink-0">
            {detail.rosters[0].players.length + detail.rosters[1].players.length} JUGADORES
          </Badge>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 min-[1180px]:grid-cols-2" data-testid="roster-grid">
          <RosterPanel roster={detail.rosters[0]} side="home" />
          <RosterPanel roster={detail.rosters[1]} side="away" />
        </div>
      </section>
      <MatchMetadataPanel
        match={detail.match}
        servingTeamName={detail.servingTeamId === detail.match.homeTeamId ? detail.match.homeTeamName : detail.match.awayTeamName}
        tournamentName={detail.tournamentName}
      />
    </>
  );
}
