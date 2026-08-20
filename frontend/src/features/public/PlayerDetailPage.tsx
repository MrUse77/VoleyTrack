import { Link, useParams } from "@tanstack/react-router";
import { Card } from "../../components/primitives/Card";
import { StateBoundary } from "../../components/states/StateBoundary";
import {
	PUBLIC_LIVE_MATCH_DETAILS,
	PUBLIC_PLAYER_DETAILS,
	PUBLIC_PLAYERS,
	PUBLIC_TEAMS,
	type MatchFixture,
	type PlayerStatBreakdownFixture,
} from "../../fixtures";

const statToneClasses: Record<
	PlayerStatBreakdownFixture["tone"],
	Readonly<{ bar: string; text: string }>
> = {
	attack: { bar: "bg-vt-accent", text: "text-vt-accent" },
	block: { bar: "bg-blue-500", text: "text-blue-500" },
	defense: { bar: "bg-purple-500", text: "text-purple-500" },
	reception: { bar: "bg-pink-500", text: "text-pink-500" },
	serve: { bar: "bg-green-500", text: "text-green-500" },
};

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
					<Card data-testid="player-not-found">
						<h1 className="text-2xl font-bold text-vt-text">
							Jugador no encontrado
						</h1>
						<p className="mt-2 text-sm text-vt-muted">
							No existe un perfil público para este jugador.
						</p>
						<Link
							className="mt-4 inline-flex min-h-6 items-center text-sm font-semibold text-vt-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
							to={"/players" as string}
						>
							← Volver a jugadores
						</Link>
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
				<Card
					aria-labelledby="player-name"
					className="relative overflow-hidden border-transparent bg-vt-panel p-6 sm:p-8 min-[1416px]:h-[180px] min-[1416px]:p-0"
					data-testid="player-hero"
				>
					<span
						aria-hidden="true"
						className="pointer-events-none absolute -right-1 -top-5 hidden text-[220px] font-black leading-none text-white/[0.03] min-[720px]:block"
					>
						{player.number}
					</span>

					<div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center min-[1416px]:contents">
						<div
							aria-hidden="true"
							className="flex size-[100px] shrink-0 items-center justify-center rounded-full bg-vt-accent text-[40px] font-black leading-none text-white min-[1416px]:absolute min-[1416px]:left-10 min-[1416px]:top-10"
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
								className="mt-3 text-[32px] font-black leading-10 text-white min-[1416px]:absolute min-[1416px]:left-[164px] min-[1416px]:top-[50px] min-[1416px]:mt-0 min-[1416px]:text-[36px]"
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

				<dl
					aria-label="Indicadores principales del jugador"
					className="mt-6 grid gap-5 sm:grid-cols-2 min-[1416px]:grid-cols-[repeat(4,261px)]"
				>
					{detail.kpis.map((kpi) => (
						<Card
							className="border-vt-raised min-[1416px]:h-[100px] min-[1416px]:rounded-xl"
							data-testid="player-kpi"
							key={kpi.label}
						>
							<dt className="text-sm leading-4 text-vt-muted">{kpi.label}</dt>
							<dd className="mt-2 text-[32px] font-black leading-8 text-white">{kpi.value}</dd>
						</Card>
					))}
				</dl>

				<div className="mt-6 grid gap-6 min-[1416px]:grid-cols-[repeat(2,540px)]">
					<Card
						aria-labelledby="player-stat-breakdown-title"
						className="min-w-0 border-vt-raised min-[1416px]:h-[400px]"
					>
						<h2
							className="text-lg font-bold leading-6 text-white"
							id="player-stat-breakdown-title"
						>
							Desglose por Fundamento
						</h2>
						<div className="mt-8 space-y-6 min-[1416px]:space-y-10">
							{detail.statBreakdown.map((stat) => {
								const tone = statToneClasses[stat.tone];

								return (
									<div
										className="flex flex-wrap items-start text-sm font-bold leading-4"
										key={stat.id}
									>
										<p className="w-[150px] text-vt-muted">{stat.label}</p>
										<p className={`ml-auto w-[60px] text-right min-[1416px]:ml-1.5 ${tone.text}`}>
											{stat.value}
										</p>
										<div
											aria-label={`${stat.label}: ${stat.value}`}
											aria-valuemax={100}
											aria-valuemin={0}
											aria-valuenow={stat.barPercent}
											className="mt-3 h-2 w-full overflow-hidden rounded-full bg-vt-raised min-[1416px]:ml-5 min-[1416px]:mt-1 min-[1416px]:w-[250px]"
											role="progressbar"
										>
											<span
												className={`block h-full rounded-full ${tone.bar}`}
												style={{ width: `${stat.barPercent}%` }}
											/>
										</div>
									</div>
								);
							})}
						</div>
					</Card>

					<Card
						aria-labelledby="player-recent-matches-title"
						className="min-w-0 border-vt-raised min-[1416px]:h-[400px]"
					>
						<h2
							className="text-lg font-bold leading-6 text-white"
							id="player-recent-matches-title"
						>
							Últimos Partidos
						</h2>
						<ul className="mt-8 space-y-4">
							{detail.recentMatches.map((performance) => {
								const { match } = performance;
								const opponent = opponentName(match, player.teamId);
								const metadata = `${match.badgeLabel} · ${performance.tournamentName} · ${match.venue}`;
								const liveRouteAvailable = hasLiveDetail(match);

								return (
									<li
										className="relative min-h-[60px] rounded-lg border border-vt-raised bg-vt-background py-3 pl-10 pr-4 min-[1416px]:h-[60px] min-[1416px]:p-0"
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
													className="block truncate text-base font-bold leading-5 text-white hover:text-vt-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
													to={`/matches/${match.id}/live` as string}
												>
													vs {opponent}
												</Link>
											) : (
												<p className="truncate text-base font-bold leading-5 text-white">
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
					</Card>
				</div>
			</div>
		</StateBoundary>
	);
}
