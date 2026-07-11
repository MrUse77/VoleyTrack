import { Link, useParams } from "@tanstack/react-router";
import { Card } from "../../components/primitives/Card";
import { PUBLIC_PLAYERS, PUBLIC_TEAMS } from "../../fixtures";

function findPlayer(id: string) {
	return PUBLIC_PLAYERS.find((player) => player.id === id);
}

function findTeam(teamId: string) {
	return PUBLIC_TEAMS.find((team) => team.id === teamId);
}

export function PlayerDetailPage() {
	const { id } = useParams({ strict: false }) as { id: string };
	const player = findPlayer(id);
	const team = player ? findTeam(player.teamId) : undefined;

	if (!player) {
		return (
			<Card>
				<h1 className="text-2xl font-bold text-vt-text">
					Jugador no encontrado
				</h1>
				<Link
					className="mt-4 inline-block text-sm font-semibold text-vt-accent"
					to={"/players" as string}
				>
					← Volver a jugadores
				</Link>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			<header>
				<Link
					className="text-sm font-semibold text-vt-accent"
					to={"/players" as string}
				>
					← Jugadores
				</Link>
				<p className="mt-5 text-sm text-vt-muted">
					Jugadores / {player.fullName}
				</p>
				<h1 className="mt-2 text-3xl font-black text-vt-text">
					#{player.number} {player.fullName}
				</h1>
				<p className="mt-2 text-sm text-vt-muted">
					{player.position}
					{team ? ` · ${team.name}` : null}
				</p>
			</header>

			<Card className="border-vt-border bg-vt-raised p-6">
				<h2 className="text-2xl font-black text-vt-text">
					Biografía
				</h2>
				<p className="mt-5 text-sm text-vt-text">{player.bio}</p>
			</Card>

			{team ? (
				<Card>
					<h2 className="text-lg font-bold text-vt-text">
						Equipo
					</h2>
					<Link
						className="mt-2 inline-block text-sm font-semibold text-vt-accent"
						to={`/teams/${team.id}` as string}
					>
						{team.name} →
					</Link>
				</Card>
			) : null}
		</div>
	);
}
