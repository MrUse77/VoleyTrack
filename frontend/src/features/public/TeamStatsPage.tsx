import { useParams } from "@tanstack/react-router";
import { Card } from "../../components/primitives/Card";
import {
  findTeamJourney,
  TeamJourney,
  TeamNotFound,
  TeamPlayerName,
  teamRosterRows,
} from "./TeamJourney";

export function TeamStatsPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const context = findTeamJourney(id);

  if (!context) return <TeamNotFound />;

  if (!context.detail) {
    return (
      <TeamJourney activeTab="stats" {...context}>
        <Card>
          <h2 className="text-xl font-black text-vt-text">Estadísticas del Equipo</h2>
          <p className="mt-4 text-sm text-vt-muted">No hay estadísticas registradas para este equipo.</p>
        </Card>
      </TeamJourney>
    );
  }

  const roster = teamRosterRows(context);

  return (
    <TeamJourney activeTab="stats" {...context}>
      <section aria-labelledby="team-stats-title">
        <h2 className="text-lg font-bold leading-6 text-vt-accent" id="team-stats-title">Estadísticas del Equipo</h2>

        <div
          aria-labelledby="team-stats-filter-label"
          className="mt-4 rounded-2xl border border-vt-border bg-vt-surface-2 px-[22px] py-3 min-[1416px]:h-[58px]"
          data-testid="team-stats-filter"
          role="group"
        >
          <div className="flex flex-col gap-3 min-[1416px]:h-[34px] min-[1416px]:flex-row min-[1416px]:items-center min-[1416px]:gap-3">
            <p
              className="text-[13px] font-black leading-4 text-vt-text min-[1416px]:w-[178px] min-[1416px]:shrink-0 min-[1416px]:-translate-y-px"
              id="team-stats-filter-label"
            >
              Filtrar estadística
            </p>
            <ul className="flex flex-wrap gap-3">
              {context.detail.statCategories.map((category, index) => (
                <li key={category.id}>
                  <span
                    aria-current={index === 0 ? "true" : undefined}
                    className={`inline-flex min-h-[34px] w-[132px] items-center justify-center rounded-full px-4 text-[11px] font-bold ${index === 0 ? "bg-vt-text font-black text-vt-background" : "bg-vt-surface text-vt-muted"}`}
                  >
                    {category.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Card
          className="mt-7 overflow-hidden p-5 min-[1416px]:h-[534px] min-[1416px]:p-[22px] min-[1416px]:pt-5"
          data-testid="team-stats-leaderboard"
        >
          <div className="flex h-[18px] items-center justify-between gap-4">
            <h3 className="text-[15px] font-black leading-[18px] text-vt-text">Ranking de Jugadores · Puntos Totales</h3>
            <p className="text-[11px] leading-[14px] text-vt-muted">Total del torneo</p>
          </div>
          <ol className="mt-5 space-y-5">
            {roster.map(({ player, stats }, index) => (
              <li
                className="flex min-h-[72px] items-center rounded-xl bg-vt-surface-2 px-5 min-[1416px]:h-[72px]"
                key={player.id}
              >
                <span className={`ml-1 w-10 text-center text-sm font-black ${index === 0 ? "text-vt-accent" : "text-vt-muted"}`}>
                  {index + 1}
                </span>
                <TeamPlayerName
                  className="ml-9 inline-block w-[300px] shrink-0 font-black text-vt-text"
                  player={player}
                />
                <span className="ml-[50px] w-[200px] text-xs text-vt-muted">{player.position}</span>
                <span className={`ml-auto w-40 text-right text-xl font-black ${index === 0 ? "text-vt-accent" : "text-vt-text"}`}>
                  {stats?.points ?? 0} pts
                </span>
              </li>
            ))}
          </ol>
        </Card>
      </section>
    </TeamJourney>
  );
}
