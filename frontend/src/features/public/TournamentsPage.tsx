import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Badge } from "../../components/primitives/Badge";
import { Card } from "../../components/primitives/Card";
import { PageHeader } from "../../components/primitives/PageHeader";
import { TabBar } from "../../components/primitives/TabBar";
import { PUBLIC_TOURNAMENTS, type TournamentFixture } from "../../fixtures";

type TournamentFilter = "todos" | "en-curso" | "proximos" | "finalizados";

const filterTabs = [
  { label: "Todos", value: "todos" },
  { label: "En curso", value: "en-curso" },
  { label: "Próximos", value: "proximos" },
  { label: "Finalizados", value: "finalizados" },
] as const;

const filterCards = [
  { detail: "Mostrar todos", label: "TODOS", status: "todos", value: "12" },
  { detail: "Jugándose", label: "EN CURSO", status: "en-curso", value: "4" },
  { detail: "Por empezar", label: "PRÓXIMOS", status: "proximos", value: "3" },
  { detail: "Terminados", label: "FINALIZADOS", status: "finalizados", value: "5" },
] as const;

const badgeVariants = {
  finished: "default",
  "in-progress": "success",
  upcoming: "accent",
} as const;

function tournamentFilter(value: unknown): TournamentFilter {
  return value === "en-curso" || value === "proximos" || value === "finalizados" ? value : "todos";
}

function visibleTournaments(status: TournamentFilter): readonly TournamentFixture[] {
  switch (status) {
    case "en-curso":
      return PUBLIC_TOURNAMENTS.inProgress;
    case "proximos":
      return PUBLIC_TOURNAMENTS.upcoming;
    case "finalizados":
      return PUBLIC_TOURNAMENTS.finished;
    default:
      return PUBLIC_TOURNAMENTS.all;
  }
}

export function TournamentsPage() {
  const location = useLocation() as { search: Record<string, unknown> };
  const [status, setStatus] = useState<TournamentFilter>(() => tournamentFilter(location.search.status));
  const tournaments = visibleTournaments(status);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Torneos"
        description="Explorá torneos activos, posiciones, próximos partidos y resultados recientes."
      />

      <section aria-label="Resumen de estados" className="grid gap-6 xl:grid-cols-4">
        {filterCards.map((filter) => {
          const active = status === filter.status;
          return (
            <button
              aria-pressed={active}
              className={`rounded-[14px] text-left transition ${active ? "ring-1 ring-vt-accent" : ""}`}
              key={filter.status}
              onClick={() => setStatus(filter.status)}
              type="button"
            >
              <Card className="p-[18px]">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className={`text-xs font-bold tracking-[0.08em] ${active ? "text-vt-accent" : "text-vt-muted"}`}>{filter.label}</p>
                    <p className="mt-4 text-3xl font-black text-vt-text">{filter.value}</p>
                  </div>
                  <p className={active ? "text-xs font-bold text-vt-accent" : "text-xs font-bold text-vt-muted"}>{filter.detail}</p>
                </div>
              </Card>
            </button>
          );
        })}
      </section>

      <TabBar
        aria-label="Filtrar torneos por estado"
        onChange={(value) => setStatus(tournamentFilter(value))}
        tabs={[...filterTabs]}
        value={status}
      />

      <section aria-label="Lista de torneos">
        <h2 className="mb-4 text-lg font-bold text-vt-text">{status === "todos" ? "Torneos destacados" : "Torneos"}</h2>
        <div className="grid gap-4 xl:grid-cols-3">
          {tournaments.map((tournament) => (
            <Card data-testid="public-tournament-card" key={tournament.id} className="border-vt-border bg-vt-surface p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="font-bold text-vt-text">{tournament.name}</p>
                <Badge variant={badgeVariants[tournament.status]}>{tournament.statusLabel}</Badge>
              </div>
              <p className="mt-4 text-sm text-vt-muted">{tournament.dateLabel}</p>
              <p className="mt-1 text-sm text-vt-muted">{tournament.location}</p>
              <Link className="mt-4 inline-block text-sm font-semibold text-vt-accent" to={`/tournaments/${tournament.id}` as string}>Ver torneo →</Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
