import { useParams } from "@tanstack/react-router";
import { NavigationLink as Link } from "../../components/navigation/NavigationLink";
import { useState } from "react";
import { Button } from "../../components/primitives/Button";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { Card } from "../../components/primitives/Card";
import { Badge } from "../../components/primitives/Badge";
import { EmptyState } from "../../components/primitives/EmptyState";
import { PageHeader } from "../../components/primitives/PageHeader";
import { SCORING } from "../../fixtures";

export function PostMatchSummaryPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const summary = SCORING.summary.matchId === id ? SCORING.summary : undefined;
  const [reviewCompleted, setReviewCompleted] = useState(false);

  if (!summary) {
    /*
     * The unknown-id fallback, on the same primitives as every other not-found branch in the
     * app (`AdminTeamNotFound` / `AdminTournamentNotFound`): the design's structural `Card`
     * (`padded={false}`, voleytrack.css:75-78) holding the announced `role="status"`
     * `EmptyState` block, with the way back as the design's ghost `.btn`. The design has no
     * counterpart for this branch (its prototype always resolves the match it links to), so
     * `EmptyState` is the app's own aligned block rather than a design region.
     *
     * Before this, the branch rendered the legacy uniform-padding `Card` plus its own `<h1>`
     * and paragraph: the last screen in the app that still built a fallback by hand.
     */
    return (
      <Card padded={false}>
        <EmptyState
          description="No hay un resumen disponible para este partido."
          title="Partido no encontrado"
        />
        <div className="px-5 pb-[18px]">
          <Link className={buttonClasses("ghost")} to="/admin/matches">
            ← Volver a partidos
          </Link>
        </div>
      </Card>
    );
  }

  const completedSets = summary.sets ?? [];
  const statistics = summary.stats ?? [];
  const mvp = summary.mvp ?? null;

  return (
    <div className="space-y-6">
      <PageHeader
        description="Resultado final, sets completados y resumen local del partido."
        eyebrow="Planillero"
        title={summary.title}
      />
      <div className="space-y-6">
        <section aria-labelledby="final-score-heading">
          <Card className="border-vt-border p-6 sm:p-8" variant="raised">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Badge variant="success">{summary.statusLabel}</Badge>
                <h2 className="mt-4 text-xl font-black text-vt-text" id="final-score-heading">
                  Marcador final
                </h2>
              </div>
              <p className="text-sm text-vt-muted">Partido terminado</p>
            </div>

            <div
              aria-label={`Marcador final: ${summary.homeTeamName} ${summary.finalScore.home}, ${summary.awayTeamName} ${summary.finalScore.away}`}
              className="mt-8 grid items-center gap-5 md:grid-cols-[1fr_auto_1fr]"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-vt-muted">Local</p>
                <p className="mt-2 text-xl font-black text-vt-text">{summary.homeTeamName}</p>
              </div>
              <p className="text-center text-5xl font-black tracking-tight text-vt-accent sm:text-6xl">
                {summary.finalScore.home} – {summary.finalScore.away}
              </p>
              <div className="md:text-right">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-vt-muted">Visitante</p>
                <p className="mt-2 text-xl font-black text-vt-text">{summary.awayTeamName}</p>
              </div>
            </div>
          </Card>
        </section>

        <section aria-labelledby="set-history-heading">
          <Card>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-vt-text" id="set-history-heading">
                  Resultados por set
                </h2>
                <p className="mt-1 text-sm text-vt-muted">Historial de sets completados</p>
              </div>
              <p className="text-sm font-semibold text-vt-muted">
                {completedSets.length > 0 ? `${completedSets.length} sets` : "Sin datos"}
              </p>
            </div>

            {completedSets.length > 0 ? (
              <ol className="mt-5 grid gap-3">
                {completedSets.map((set) => {
                  const winner = set.home === set.away
                    ? "Sin ganador registrado"
                    : `Ganó ${set.home > set.away ? summary.homeTeamName : summary.awayTeamName}`;

                  return (
                    <li
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-vt-border bg-vt-panel px-4 py-3"
                      key={set.id}
                    >
                      <span className="min-w-20 text-sm font-bold text-vt-text">{set.label}</span>
                      <span
                        aria-label={`${set.label}: ${summary.homeTeamName} ${set.home}, ${summary.awayTeamName} ${set.away}`}
                        className="text-xl font-black text-vt-accent"
                      >
                        {set.home} – {set.away}
                      </span>
                      <span className="text-xs text-vt-muted">{winner}</span>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <p className="mt-5 rounded-xl border border-dashed border-vt-border p-4 text-sm text-vt-muted" role="status">
                No hay resultados por set disponibles para este partido.
              </p>
            )}
          </Card>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
          <section aria-labelledby="match-stats-heading">
            <Card className="h-full">
              <div>
                <h2 className="text-lg font-black text-vt-text" id="match-stats-heading">
                  Estadísticas del partido
                </h2>
                <p className="mt-1 text-sm text-vt-muted">Comparativa de métricas registradas en la planilla local</p>
              </div>

              {statistics.length > 0 ? (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[30rem] border-separate border-spacing-y-2 text-sm">
                    <caption className="sr-only">
                      Estadísticas de {summary.homeTeamName} y {summary.awayTeamName}
                    </caption>
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-bold uppercase tracking-[0.12em] text-vt-muted" scope="col">
                          Métrica
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-bold uppercase tracking-[0.12em] text-vt-muted" scope="col">
                          {summary.homeTeamName}
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-bold uppercase tracking-[0.12em] text-vt-muted" scope="col">
                          {summary.awayTeamName}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {statistics.map((metric) => (
                        <tr className="bg-vt-panel" key={metric.id}>
                          <th className="rounded-l-lg px-4 py-3 text-left font-semibold text-vt-text" scope="row">
                            {metric.label}
                          </th>
                          <td className="px-4 py-3 text-right text-lg font-black text-vt-accent">{metric.home}</td>
                          <td className="rounded-r-lg px-4 py-3 text-right text-lg font-black text-vt-text">{metric.away}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-5 rounded-xl border border-dashed border-vt-border p-4 text-sm text-vt-muted" role="status">
                  No hay estadísticas registradas para este partido.
                </p>
              )}
            </Card>
          </section>

          <section aria-labelledby="mvp-heading">
            <Card className="h-full">
              <h2 className="text-lg font-black text-vt-text" id="mvp-heading">
                Jugador del partido (MVP)
              </h2>
              {mvp ? (
                <div className="mt-6 flex items-center gap-4 rounded-xl border border-vt-accent/30 bg-vt-accent/10 p-4">
                  <div
                    aria-label={`Camiseta número ${mvp.number}`}
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-vt-accent text-2xl font-black text-vt-background"
                    role="img"
                  >
                    #{mvp.number}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-xl font-black text-vt-text">{mvp.playerName}</h3>
                    <p className="mt-1 text-sm font-semibold text-vt-accent">{mvp.teamName}</p>
                    <p className="mt-2 text-sm leading-5 text-vt-muted">{mvp.detail}</p>
                  </div>
                </div>
              ) : (
                <p className="mt-5 rounded-xl border border-dashed border-vt-border p-4 text-sm text-vt-muted" role="status">
                  Todavía no se registró un jugador del partido.
                </p>
              )}
            </Card>
          </section>
        </div>

        <section aria-labelledby="closing-actions-heading">
          <Card className="border-vt-border bg-vt-panel p-5 sm:p-6">
            <h2 className="text-lg font-black text-vt-text" id="closing-actions-heading">
              Acciones de cierre
            </h2>
            <p className="mt-1 text-sm text-vt-muted">
              Elegí cómo continuar. Las acciones de esta versión son locales y no publican ni guardan cambios.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg bg-vt-accent px-4 text-sm font-semibold text-vt-background hover:bg-vt-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
                to="/admin/matches"
              >
                Volver a partidos
              </Link>
              <Link
                className="inline-flex h-10 items-center justify-center rounded-lg border border-vt-border px-4 text-sm font-semibold text-vt-text hover:bg-vt-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
                to={`/matches/${summary.matchId}/live` as string}
              >
                Abrir vista pública
              </Link>
              <Button
                aria-describedby="local-review-note"
                onClick={() => setReviewCompleted(true)}
                variant="ghost"
              >
                {reviewCompleted ? "Revisión finalizada" : "Finalizar revisión"}
              </Button>
            </div>
            <p className="mt-4 text-xs text-vt-muted" id="local-review-note">
              El estado de revisión se mantiene solo en esta sesión; no se persiste ni se envía a un servidor.
            </p>
            <p aria-live="polite" className="sr-only" role="status">
              {reviewCompleted ? "Revisión finalizada solo en esta sesión." : ""}
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
}
