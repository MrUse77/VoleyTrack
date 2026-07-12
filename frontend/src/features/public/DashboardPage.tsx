import { Link } from "@tanstack/react-router";
import { Badge } from "../../components/primitives/Badge";
import { Card } from "../../components/primitives/Card";
import { PageHeader } from "../../components/primitives/PageHeader";
import { StateBoundary } from "../../components/states/StateBoundary";
import { PUBLIC_MATCHES, PUBLIC_TEAMS, PUBLIC_TOURNAMENTS } from "../../fixtures";

const matchBadgeVariant = {
  finished: "default",
  live: "danger",
  today: "accent",
  upcoming: "default",
} as const;

const tournamentBadgeVariant = {
  finished: "default",
  "in-progress": "success",
  upcoming: "accent",
} as const;

export function DashboardPage() {
  const liveMatch = PUBLIC_MATCHES.live[0];
  const scheduledMatches = [...PUBLIC_MATCHES.upcoming, ...PUBLIC_MATCHES.today];
  const metrics = [
    { label: "EN VIVO", value: PUBLIC_MATCHES.live.length, detail: "Ahora" },
    { label: "PRÓXIMOS", value: scheduledMatches.length, detail: "Esta semana" },
    { label: "TORNEOS", value: PUBLIC_TOURNAMENTS.inProgress.length, detail: "Activos" },
    { label: "EQUIPOS", value: PUBLIC_TEAMS.length, detail: "Registrados" },
  ];

  return (
    <StateBoundary>
      <div className="space-y-8">
      <PageHeader
        title="Dashboard público"
        description="Seguí partidos en vivo, próximos encuentros, torneos activos y estadísticas generales."
        actions={<Badge variant="success">Datos actualizados ahora</Badge>}
      />

      <section aria-label="Métricas del dashboard" className="grid gap-4 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} data-testid="dashboard-metric-card" className="p-5">
            <p className="text-xs font-bold tracking-[0.08em] text-vt-muted">{metric.label}</p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <p className="text-3xl font-bold tracking-tight text-vt-text">{metric.value}</p>
              <p className="text-xs font-semibold text-vt-muted">{metric.detail}</p>
            </div>
          </Card>
        ))}
      </section>

      <section aria-labelledby="live-matches-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="live-matches-heading" className="text-lg font-bold text-vt-text">Partidos en vivo</h2>
          <Link className="text-sm font-semibold text-vt-accent" search={{ status: "live" }} to="/matches">Ver todos</Link>
        </div>
        <Card data-testid="dashboard-match-card" className="border-vt-raised-border bg-vt-surface">
          <div className="flex items-center justify-between gap-4">
            <Badge variant={matchBadgeVariant[liveMatch.status]}>{liveMatch.badgeLabel}</Badge>
            <p className="text-sm text-vt-muted">{liveMatch.scheduledLabel}</p>
          </div>
          <div className="mt-6 grid items-center gap-4 text-center md:grid-cols-[1fr_auto_1fr]">
            <div>
              <p className="text-xl font-bold text-vt-text">{liveMatch.homeTeamName}</p>
              <p className="mt-1 text-sm text-vt-muted">Local</p>
            </div>
            <p className="rounded-xl bg-vt-panel px-5 py-3 text-2xl font-bold text-vt-accent">
              {liveMatch.score?.home} - {liveMatch.score?.away}
            </p>
            <div>
              <p className="text-xl font-bold text-vt-text">{liveMatch.awayTeamName}</p>
              <p className="mt-1 text-sm text-vt-muted">Visitante</p>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-vt-border pt-4 text-sm text-vt-muted">
            <span>{liveMatch.venue}</span>
            <Link className="font-semibold text-vt-accent" to={`/matches/${liveMatch.id}/live` as string}>Ver detalle →</Link>
          </div>
        </Card>
      </section>

      <section aria-labelledby="upcoming-matches-heading">
        <h2 id="upcoming-matches-heading" className="mb-4 text-lg font-bold text-vt-text">Próximos partidos</h2>
        <div className="grid gap-4 xl:grid-cols-2">
          {scheduledMatches.map((match) => (
            <Card key={match.id} data-testid="dashboard-match-card" className="p-5">
              <div className="flex items-center justify-between gap-4">
                <Badge variant={matchBadgeVariant[match.status]}>{match.badgeLabel}</Badge>
                <p className="text-xs font-semibold text-vt-muted">{match.scheduledLabel}</p>
              </div>
              <p className="mt-4 font-bold text-vt-text">{match.homeTeamName} vs {match.awayTeamName}</p>
              <p className="mt-2 text-sm text-vt-muted">{match.venue}</p>
                <Link className="mt-4 inline-block text-sm font-semibold text-vt-accent" to={`/matches/${match.id}/live` as string}>Ver detalle →</Link>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="tournaments-heading">
        <h2 id="tournaments-heading" className="mb-4 text-lg font-bold text-vt-text">Torneos</h2>
        <div className="grid gap-4 xl:grid-cols-3">
          {PUBLIC_TOURNAMENTS.all.map((tournament) => (
            <Card key={tournament.id} data-testid="dashboard-tournament-card" className="p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-bold text-vt-text">{tournament.name}</p>
                <Badge variant={tournamentBadgeVariant[tournament.status]}>{tournament.statusLabel}</Badge>
              </div>
              <p className="mt-4 text-sm text-vt-muted">{tournament.dateLabel}</p>
              <p className="mt-1 text-sm text-vt-muted">{tournament.location}</p>
                <Link className="mt-4 inline-block text-sm font-semibold text-vt-accent" to={`/tournaments/${tournament.id}` as string}>Ver torneo →</Link>
            </Card>
          ))}
        </div>
      </section>
      </div>
    </StateBoundary>
  );
}
