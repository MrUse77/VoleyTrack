import { Link } from "@tanstack/react-router";
import { Badge } from "../../components/primitives/Badge";
import { Card } from "../../components/primitives/Card";
import { PageHeader } from "../../components/primitives/PageHeader";
import { StateBoundary } from "../../components/states/StateBoundary";
import { PUBLIC_DASHBOARD } from "../../fixtures";

const tableHeadingClass = "px-6 py-3 text-[11px] font-bold tracking-[0.08em] text-vt-muted";
const tableCellClass = "px-6 py-5 text-xs text-vt-muted";

export function DashboardPage() {
  const { featured, compact } = PUBLIC_DASHBOARD.live;

  return (
    <StateBoundary>
      <div className="mx-auto w-full max-w-[1104px]" data-testid="dashboard-content">
        <PageHeader
          title="Dashboard público"
          description="Seguí partidos en vivo, próximos encuentros, torneos activos y estadísticas generales."
          variant="compact"
        />

        <section aria-label="Métricas del dashboard" className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {PUBLIC_DASHBOARD.metrics.map((metric) => {
            const card = (
              <Card
                data-testid="dashboard-metric-card"
                className="min-h-24 rounded-[14px] p-5"
                variant="surface"
              >
                <p className="text-[11px] font-bold tracking-[0.08em] text-vt-muted">{metric.label}</p>
                <div className="mt-1 flex items-center justify-between gap-4">
                  <p className="text-[34px] font-bold leading-tight tracking-tight text-vt-text">{metric.value}</p>
                  {metric.detail ? (
                    <p className={`text-xs font-bold ${metric.detail === "7 días" ? "text-vt-accent" : "text-vt-muted"}`}>
                      {metric.detail}
                    </p>
                  ) : (
                    <span aria-hidden="true" className="mr-5 size-2.5 rounded-full bg-vt-success shadow-[0_0_0_12px_color-mix(in_oklch,var(--color-vt-success)_18%,transparent)]" />
                  )}
                </div>
              </Card>
            );

            return metric.href ? (
              <Link
                className="rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vt-accent"
                key={metric.label}
                to={metric.href as string}
              >
                {card}
              </Link>
            ) : (
              <div key={metric.label}>{card}</div>
            );
          })}
        </section>

        <section aria-labelledby="live-matches-heading" className="mt-10">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 id="live-matches-heading" className="text-[17px] font-bold text-vt-text">Partidos en vivo</h2>
            <Link className="text-xs font-bold text-vt-accent hover:underline" search={{ status: "live" }} to="/matches">
              Ver todos
            </Link>
          </div>

          <div
            className="grid grid-cols-1 gap-6 min-[1416px]:grid-cols-[716px_364px]"
            data-testid="dashboard-live-grid"
          >
            <Card
              data-testid="dashboard-live-featured"
              className="flex min-h-[184px] flex-col p-5"
              variant="surface"
            >
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="danger">LIVE</Badge>
                <p className="text-xs text-vt-muted">
                  {featured.tournamentName} · {featured.match.scheduledLabel}
                </p>
              </div>

              <div className="mt-6 grid flex-1 items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
                <div>
                  <p className="text-2xl font-bold text-vt-text">{featured.match.homeTeamName}</p>
                  <p className="mt-1 text-[13px] text-vt-muted">Sets ganados: {featured.homeSetsWon}</p>
                </div>
                <p className="rounded-[14px] bg-vt-panel px-5 py-3 text-center text-[28px] font-black leading-tight text-vt-accent">
                  {featured.match.score.home} - {featured.match.score.away}
                </p>
                <div className="text-left sm:text-right">
                  <p className="text-2xl font-bold text-vt-text">{featured.match.awayTeamName}</p>
                  <p className="mt-1 text-[13px] text-vt-muted">Sets ganados: {featured.awaySetsWon}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-vt-border pt-2 text-[11px] text-vt-muted">
                <span>Última acción: {featured.latestAction}</span>
                <Link className="font-bold text-vt-accent hover:underline" to={`/matches/${featured.match.id}/live` as string}>
                  Ver detalle →
                </Link>
              </div>
            </Card>

            <div className="grid gap-3">
              {compact.map(({ match, tournamentName }) => (
                <Link
                  aria-label={`Ver ${match.homeTeamName} vs ${match.awayTeamName} en vivo`}
                  className="block rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vt-accent"
                  key={match.id}
                  to={`/matches/${match.id}/live` as string}
                >
                  <Card
                    data-testid="dashboard-live-compact"
                    className="min-h-[86px] rounded-[14px] p-4 transition hover:border-vt-accent/50"
                    variant="surface"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-vt-danger">LIVE</p>
                        <p className="mt-1 truncate text-sm font-bold text-vt-text">
                          {match.homeTeamName} vs {match.awayTeamName}
                        </p>
                        <p className="mt-1 text-[11px] text-vt-muted">
                          {tournamentName} · {match.scheduledLabel}
                        </p>
                      </div>
                      <p className="shrink-0 text-[22px] font-black text-vt-accent">
                        {match.score.home}-{match.score.away}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="upcoming-matches-heading" className="mt-10">
          <h2 id="upcoming-matches-heading" className="mb-5 text-[17px] font-bold text-vt-text">Próximos partidos</h2>
          <Card className="overflow-x-auto p-0" variant="surface">
            <table className="w-full min-w-[920px] table-fixed border-collapse text-left">
              <caption className="sr-only">Próximos partidos programados</caption>
              <thead className="bg-vt-panel">
                <tr>
                  <th className={`${tableHeadingClass} w-[17%]`} scope="col">FECHA</th>
                  <th className={`${tableHeadingClass} w-[33%]`} scope="col">PARTIDO</th>
                  <th className={`${tableHeadingClass} w-[18%]`} scope="col">TORNEO</th>
                  <th className={`${tableHeadingClass} w-[18%]`} scope="col">SEDE</th>
                  <th className={`${tableHeadingClass} w-[14%] text-right`} scope="col">ESTADO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vt-border">
                {PUBLIC_DASHBOARD.upcoming.map(({ match, tournamentName }) => {
                  const confirmed = match.badgeLabel === "Confirmado";
                  return (
                    <tr data-testid="dashboard-upcoming-row" key={match.id}>
                      <td className={`${tableCellClass} font-bold ${confirmed ? "text-vt-accent" : ""}`}>
                        {match.scheduledLabel}
                      </td>
                      <td className={`${tableCellClass} text-[13px] font-bold text-vt-text`}>
                        <Link className="hover:text-vt-accent hover:underline" to={`/matches/${match.id}/live` as string}>
                          {match.homeTeamName} vs {match.awayTeamName}
                        </Link>
                      </td>
                      <td className={tableCellClass}>{tournamentName}</td>
                      <td className={tableCellClass}>{match.venue}</td>
                      <td className={`${tableCellClass} text-right font-bold ${confirmed ? "text-vt-success" : ""}`}>
                        {match.badgeLabel}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        </section>
      </div>
    </StateBoundary>
  );
}
