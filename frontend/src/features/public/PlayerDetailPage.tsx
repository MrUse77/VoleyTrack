import { useParams } from "@tanstack/react-router";
import { NavigationLink as Link } from "../../components/navigation/NavigationLink";
import { Card, CardBody, CardHeader } from "../../components/primitives/Card";
import { EmptyState } from "../../components/primitives/EmptyState";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { Kpi, KpiGrid } from "../../components/primitives/Kpi";
import { StateBoundary } from "../../components/states/StateBoundary";
import {
	PUBLIC_LIVE_MATCH_DETAILS,
	PUBLIC_PLAYER_DETAILS,
	PUBLIC_PLAYERS,
	PUBLIC_TEAMS,
	type MatchFixture,
} from "../../fixtures";

/**
 * The design this breakdown is modelled on is the vendored `.stat-bar`
 * (frontend/design/html/voleytrack-admin.css:300-305): its value ink (`.stat-bar-val`) and its
 * fill (`.stat-bar i`) are both `var(--accent)`, and the design declares no second bar tone -
 * a purple and a pink literal appear nowhere under design/html.
 *
 * Every bar therefore carries the accent on both halves. The project owner made this call
 * explicitly and accepted its consequence: the five bars are no longer distinguishable from
 * each other by colour, so the label (and the `role="progressbar"` accessible name) is what
 * tells them apart. That trade-off is deliberate, not an oversight.
 *
 * A per-stat tone map used to live here. Its values drifted with the app rather than with the
 * design: `block` and `serve` carried the raw Tailwind palette hues `blue-500` / `green-500`
 * (close to, but not the same colour as, the design's own `--blue` #3b82f6 and `--success`
 * #22c55e - Tailwind v4 declares its palette in oklch, so the two resolve to a slightly
 * different sRGB), and `defense` / `reception` shipped `purple-500` / `pink-500`, which have no
 * counterpart anywhere in the vendored design at all. Two of those four were caught by
 * inspection rather than by the colour guard, which is why the guard now rejects Tailwind's
 * stock palette utilities outright (`styles/tokens.test.ts`). Keeping a map that returned one
 * value for all five keys would have implied the tones still meant something, so it is gone and
 * the two accent classes are written where the design declares them.
 */

function findPlayer(id: string) {
	return PUBLIC_PLAYERS.find((player) => player.id === id);
}

function findTeam(teamId: string) {
	return PUBLIC_TEAMS.find((team) => team.id === teamId);
}

function opponentName(match: MatchFixture, playerTeamId: string): string {
	return match.homeTeamId === playerTeamId
		? match.awayTeamName
		: match.homeTeamName;
}

function playerScore(match: MatchFixture, playerTeamId: string): string {
	if (!match.score) return "—";

	return match.homeTeamId === playerTeamId
		? `${match.score.home} - ${match.score.away}`
		: `${match.score.away} - ${match.score.home}`;
}

function resultTone(match: MatchFixture, playerTeamId: string): string {
	if (match.status === "live") return "bg-vt-success";
	if (match.status !== "finished" || !match.score) return "bg-vt-accent";

	const playerWon = match.homeTeamId === playerTeamId
		? match.score.home > match.score.away
		: match.score.away > match.score.home;

	return playerWon ? "bg-vt-success" : "bg-vt-danger";
}

function hasLiveDetail(match: MatchFixture): boolean {
	return match.status === "live"
		&& PUBLIC_LIVE_MATCH_DETAILS.some((detail) => detail.match === match);
}

export function PlayerDetailPage() {
	const { id } = useParams({ strict: false }) as { id: string };
	const player = findPlayer(id);
	const detail = PUBLIC_PLAYER_DETAILS.find((item) => item.playerId === id);
	const team = player ? findTeam(player.teamId) : undefined;

	if (!player || !detail || !team) {
		return (
			<StateBoundary>
				<div className="w-full max-w-[1104px] min-[1428px]:ml-3">
					<Card data-testid="player-not-found" padded={false}>
						<EmptyState
							description="No existe un perfil público para este jugador."
							title="Jugador no encontrado"
						/>
						<div className="px-5 pb-[18px]">
							<Link className={buttonClasses("ghost")} to={"/players" as string}>
								← Volver a jugadores
							</Link>
						</div>
					</Card>
				</div>
			</StateBoundary>
		);
	}

	return (
		<StateBoundary>
			<div
				className="w-full max-w-[1104px] min-[1428px]:ml-3"
				data-testid="player-detail-content"
			>
				{/*
				 * Colour-only alignment with the vendored design; the box, the absolute geometry and
				 * every breakpoint class below are unchanged.
				 *   hero surface: the `Card` primitive's own default (`variant="surface"`), which is the
				 *     design's `--surface` layer — frontend/design/html/voleytrack.css:75
				 *     `.card{background:var(--surface);border:1px solid var(--border);...}`. This call
				 *     site used to override it with the app-only panel layer, which the pack never
				 *     defined; that override is gone and the surface now comes from the primitive's
				 *     default variant alone. A call site may not name a `bg-vt-*` background on `Card`
				 *     (core.test.tsx pins that), so the design line is cited here instead.
				 *   name / number / opponent ink (was the raw white utility) -> the design's `--fg`
				 *     ink: voleytrack.css:27 `body{...color:var(--fg);...}`, which the `h1` of
				 *     voleytrack.css:66 `.page-head h1` inherits
				 *   ink on the accent avatar fill (was the raw white utility) -> the design's `--bg`,
				 *     the ink every accent fill on the pack uses, including the accent-filled number
				 *     badge this avatar is: voleytrack.css:71 `.btn.accent`, :83 `.chip.accent`,
				 *     :55 `.nav-item.active` and voleytrack-admin.css:268 `.squad-item .num-badge`
				 * The decorative number is that same `--fg` ink at 3%: the vendored ficha has no
				 * watermark, so only the colour role maps across; the 3% alpha is this screen's own.
				 */}
				<Card
					aria-labelledby="player-name"
					className="relative overflow-hidden border-transparent p-6 sm:p-8 min-[1416px]:h-[180px] min-[1416px]:p-0"
					data-testid="player-hero"
				>
					<span
						aria-hidden="true"
						className="pointer-events-none absolute -right-1 -top-5 hidden text-[220px] font-black leading-none text-vt-text/[0.03] min-[720px]:block"
					>
						{player.number}
					</span>

					<div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center min-[1416px]:contents">
						<div
							aria-hidden="true"
							className="flex size-[100px] shrink-0 items-center justify-center rounded-full bg-vt-accent text-[40px] font-black leading-none text-vt-background min-[1416px]:absolute min-[1416px]:left-10 min-[1416px]:top-10"
						>
							{player.number}
						</div>

						<div className="min-w-0 min-[1416px]:contents">
							<nav
								aria-label="Navegación del jugador"
								className="flex min-w-0 flex-wrap items-center gap-2 text-[11px] leading-[14px] text-vt-muted min-[1416px]:absolute min-[1416px]:left-[164px] min-[1416px]:top-5"
							>
								<Link
									className="font-semibold hover:text-vt-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
									to={"/players" as string}
								>
									Jugadores
								</Link>
								<span aria-hidden="true">/</span>
								<span>{detail.tournamentName}</span>
								<span aria-hidden="true">/</span>
								<span aria-current="page" className="truncate">{player.fullName}</span>
							</nav>

							<h1
								className="mt-3 text-[32px] font-black leading-10 text-vt-text min-[1416px]:absolute min-[1416px]:left-[164px] min-[1416px]:top-[50px] min-[1416px]:mt-0 min-[1416px]:text-[36px]"
								id="player-name"
							>
								{player.fullName}
							</h1>
							<p className="mt-2 text-base font-bold leading-5 text-vt-muted min-[1416px]:absolute min-[1416px]:left-[164px] min-[1416px]:top-[100px] min-[1416px]:mt-0">
								{player.position}
								<span aria-hidden="true"> | </span>
								<Link
									className="hover:text-vt-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
									to={`/teams/${team.id}` as string}
								>
									{team.name}
								</Link>
							</p>
							<p className="mt-2 text-sm leading-5 text-vt-muted min-[1416px]:absolute min-[1416px]:left-[164px] min-[1416px]:top-[130px] min-[1416px]:mt-0">
								{detail.heightLabel}
								<span aria-hidden="true"> • </span>
								{detail.weightLabel}
								<span aria-hidden="true"> • </span>
								{detail.ageLabel}
							</p>
						</div>
					</div>
				</Card>

				{/*
				 * Design: frontend/design/html/voleytrack-jugadores.html, the player view's
				 * `.kpi-grid` — four `.kpi` tiles (label, value, sub) on a 4-column grid that drops
				 * to two columns below 1200px (voleytrack-jugadores.css:3-10). `KpiGrid`/`Kpi` are
				 * that rule and tile as primitives, so the screen stops hand-rolling a `dl` of
				 * uniform-padding Cards and the values/labels come from the design's tile set.
				 */}
				<KpiGrid aria-label="Indicadores principales del jugador" className="mt-6">
					{detail.kpis.map((kpi) => (
						<Kpi
							data-testid="player-kpi"
							key={kpi.label}
							label={kpi.label}
							sub={kpi.sub}
							value={kpi.value}
						/>
					))}
				</KpiGrid>

				<div className="mt-6 grid gap-6 min-[1416px]:grid-cols-[repeat(2,540px)]">
					<Card
						aria-labelledby="player-stat-breakdown-title"
						className="min-w-0 min-[1416px]:h-[400px]"
						padded={false}
					>
						<CardHeader>
							<h2 id="player-stat-breakdown-title">Desglose por Fundamento</h2>
						</CardHeader>
						<CardBody className="space-y-6 min-[1416px]:space-y-10" data-testid="player-stat-breakdown-card-body">
							{detail.statBreakdown.map((stat) => (
								<div
									className="flex flex-wrap items-start text-sm font-bold leading-4"
									key={stat.id}
								>
									<p className="w-[150px] text-vt-muted">{stat.label}</p>
									<p className="ml-auto w-[60px] text-right text-vt-accent min-[1416px]:ml-1.5">
										{stat.value}
									</p>
									<div
										aria-label={`${stat.label}: ${stat.value}`}
										aria-valuemax={100}
										aria-valuemin={0}
										aria-valuenow={stat.barPercent}
										className="mt-3 h-2 w-full overflow-hidden rounded-full bg-vt-border-2 min-[1416px]:ml-5 min-[1416px]:mt-1 min-[1416px]:w-[250px]"
										role="progressbar"
									>
										<span
											className="block h-full rounded-full bg-vt-accent"
											style={{ width: `${stat.barPercent}%` }}
										/>
									</div>
								</div>
							))}
						</CardBody>
					</Card>

					<Card
						aria-labelledby="player-recent-matches-title"
						className="min-w-0 min-[1416px]:h-[400px]"
						padded={false}
					>
						<CardHeader>
							<h2 id="player-recent-matches-title">Últimos Partidos</h2>
						</CardHeader>
						<CardBody data-testid="player-recent-matches-card-body">
							<ul className="space-y-4">
							{detail.recentMatches.map((performance) => {
								const { match } = performance;
								const opponent = opponentName(match, player.teamId);
								const metadata = `${match.badgeLabel} · ${performance.tournamentName} · ${match.venue}`;
								const liveRouteAvailable = hasLiveDetail(match);

								return (
									<li
										className="relative min-h-[60px] rounded-lg border border-vt-border bg-vt-background py-3 pl-10 pr-4 min-[1416px]:h-[60px] min-[1416px]:p-0"
										key={match.id}
									>
										<span
											aria-hidden="true"
											className={`absolute left-4 top-[18px] h-6 w-2 rounded-full ${resultTone(match, player.teamId)}`}
										/>
										<div className="min-w-0 min-[1416px]:absolute min-[1416px]:left-10 min-[1416px]:top-[9px] min-[1416px]:w-[200px]">
											{liveRouteAvailable ? (
												<Link
													aria-label={`Ver ${opponent} en vivo`}
													className="block truncate text-base font-bold leading-5 text-vt-text hover:text-vt-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
													to={`/matches/${match.id}/live` as string}
												>
													vs {opponent}
												</Link>
											) : (
												<p className="truncate text-base font-bold leading-5 text-vt-text">
													vs {opponent}
												</p>
											)}
											<p
												className="mt-0.5 truncate text-[10px] leading-3 text-vt-muted"
												title={metadata}
											>
												{metadata}
											</p>
										</div>
										<p className="mt-2 text-sm font-bold text-vt-muted min-[1416px]:absolute min-[1416px]:left-[250px] min-[1416px]:top-[22px] min-[1416px]:mt-0 min-[1416px]:w-[60px] min-[1416px]:text-center min-[1416px]:leading-4">
											{playerScore(match, player.teamId)}
										</p>
										<p className="mt-1 text-sm font-black text-vt-accent min-[1416px]:absolute min-[1416px]:right-8 min-[1416px]:top-[22px] min-[1416px]:mt-0 min-[1416px]:w-[60px] min-[1416px]:text-right min-[1416px]:leading-4">
											{performance.playerPoints} Pts
										</p>
									</li>
								);
							})}
							</ul>
						</CardBody>
					</Card>
				</div>
			</div>
		</StateBoundary>
	);
}
