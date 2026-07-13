import { Link, useParams } from "@tanstack/react-router";
import { Badge } from "../../components/primitives/Badge";
import { Card } from "../../components/primitives/Card";
import {
	PUBLIC_MATCHES,
	type MatchFixture,
	type MatchStatus,
} from "../../fixtures";

const ALL_MATCHES: readonly MatchFixture[] = [
	...PUBLIC_MATCHES.upcoming,
	...PUBLIC_MATCHES.live,
	...PUBLIC_MATCHES.today,
	...PUBLIC_MATCHES.finished,
];

const badgeVariants: Record<MatchStatus, "default" | "success" | "accent"> = {
	finished: "default",
	live: "success",
	today: "accent",
	upcoming: "default",
};

function findMatch(id: string): MatchFixture | undefined {
	return ALL_MATCHES.find((match) => match.id === id);
}

export function LiveMatchPage() {
	const { id } = useParams({ strict: false }) as { id: string };
	const match = findMatch(id);

	if (!match) {
		return (
			<Card>
				<h1 className="text-2xl font-bold text-vt-text">
					Partido no encontrado
				</h1>
				<Link
					className="mt-4 inline-block text-sm font-semibold text-vt-accent"
					to="/matches"
				>
					← Volver a partidos
				</Link>
			</Card>
		);
	}

	return (
		<div className="space-y-6">
			<header>
				<Link
					className="text-sm font-semibold text-vt-accent"
					to="/matches"
				>
					← Partidos
				</Link>
				<p className="mt-5 text-sm text-vt-muted">
					Partidos / {match.homeTeamName} vs {match.awayTeamName}
				</p>
				<div className="mt-2 flex items-center gap-3">
					<h1 className="text-3xl font-black text-vt-text">
						{match.homeTeamName} vs {match.awayTeamName}
					</h1>
					<Badge variant={badgeVariants[match.status]}>
						{match.badgeLabel}
					</Badge>
				</div>
			</header>

			<Card className="border-vt-border bg-vt-raised p-6">
				<div className="flex flex-wrap items-center justify-between gap-6">
					<div className="space-y-2">
						<p className="text-sm text-vt-muted">
							{match.scheduledLabel}
						</p>
						<p className="text-sm text-vt-muted">{match.venue}</p>
					</div>
					{match.score ? (
						<div className="text-right">
							<p className="text-4xl font-black text-vt-text">
								{match.score.home} – {match.score.away}
							</p>
							<p className="mt-1 text-sm text-vt-muted">
								Marcador
							</p>
						</div>
					) : null}
				</div>
			</Card>

			<Card>
				<h2 className="text-lg font-bold text-vt-text">
					Información del partido
				</h2>
				<dl className="mt-5 grid gap-4 sm:grid-cols-2">
					<SummaryDetail label="Estado" value={match.badgeLabel} />
					<TeamSummaryDetail
						id={match.homeTeamId}
						label="Equipo local"
						name={match.homeTeamName}
					/>
					<TeamSummaryDetail
						id={match.awayTeamId}
						label="Equipo visitante"
						name={match.awayTeamName}
					/>
					<SummaryDetail label="Sede" value={match.venue} />
					<SummaryDetail
						label="Horario"
						value={match.scheduledLabel}
					/>
				</dl>
			</Card>
		</div>
	);
}

function TeamSummaryDetail({
	id,
	label,
	name,
}: { id: string; label: string; name: string }) {
	return (
		<div>
			<dt className="text-xs font-bold uppercase tracking-[0.08em] text-vt-muted">
				{label}
			</dt>
			<dd className="mt-1 text-sm text-vt-text">
				<Link
					className="font-semibold text-vt-accent hover:underline"
					to={`/teams/${id}` as string}
				>
					{name}
				</Link>
			</dd>
		</div>
	);
}

function SummaryDetail({
	label,
	value,
}: { label: string; value: string }) {
	return (
		<div>
			<dt className="text-xs font-bold uppercase tracking-[0.08em] text-vt-muted">
				{label}
			</dt>
			<dd className="mt-1 text-sm text-vt-text">{value}</dd>
		</div>
	);
}
