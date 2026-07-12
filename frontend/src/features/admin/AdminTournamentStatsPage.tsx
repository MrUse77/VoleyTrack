import { useState } from "react";
import { Link, useParams } from "@tanstack/react-router";
import { Card } from "../../components/primitives/Card";
import { ADMIN, type AdminTournamentFixture } from "../../fixtures";

type Statistic = "Puntos" | "Ataques" | "Bloqueos";

type Leader = {
  name: string;
  team: string;
  value: string;
};

const tournamentTabs = [
  { label: "Partidos", suffix: "/matches" },
  { label: "Tabla", suffix: "/standings" },
  { label: "Estadísticas", suffix: "/stats" },
] as const;

const rankings = Object.freeze({
  Puntos: {
    title: "Puntos Totales",
    leaders: [
      { name: "Mateo Silva", team: "River Plate", value: "128 pts" },
      { name: "Bruno Herrera", team: "Ciudad Voley", value: "119 pts" },
      { name: "Julián Acosta", team: "UPCN San Juan", value: "104 pts" },
      { name: "Tomás Núñez", team: "Boca Juniors", value: "96 pts" },
    ],
  },
  Ataques: {
    title: "Ataques Totales",
    leaders: [
      { name: "Mateo Silva", team: "River Plate", value: "82 ataques" },
      { name: "Julián Acosta", team: "UPCN San Juan", value: "76 ataques" },
      { name: "Bruno Herrera", team: "Ciudad Voley", value: "71 ataques" },
      { name: "Tomás Núñez", team: "Boca Juniors", value: "64 ataques" },
    ],
  },
  Bloqueos: {
    title: "Bloqueos Totales",
    leaders: [
      { name: "Tomás Núñez", team: "Boca Juniors", value: "24 bloqueos" },
      { name: "Julián Acosta", team: "UPCN San Juan", value: "21 bloqueos" },
      { name: "Mateo Silva", team: "River Plate", value: "18 bloqueos" },
      { name: "Bruno Herrera", team: "Ciudad Voley", value: "16 bloqueos" },
    ],
  },
} satisfies Readonly<Record<Statistic, { title: string; leaders: readonly Leader[] }>>);

function findTournament(id: string): AdminTournamentFixture | undefined {
  return ADMIN.tournaments.find((tournament) => tournament.id === id);
}

export function AdminTournamentStatsPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const tournament = findTournament(id);
  const [statistic, setStatistic] = useState<Statistic>("Puntos");

  if (!tournament) {
    return (
      <Card>
        <h1 className="text-2xl font-bold text-vt-text">Torneo no encontrado</h1>
        <Link className="mt-4 inline-block text-sm font-semibold text-vt-accent" to={"/admin/tournaments" as string}>
          ← Volver a torneos
        </Link>
      </Card>
    );
  }

  const ranking = rankings[statistic];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link className="text-sm font-semibold text-vt-accent" to={"/admin/tournaments" as string}>
            ← Torneos
          </Link>
          <p className="mt-5 text-sm text-vt-muted">Administración / Torneos / {tournament.name}</p>
          <h1 className="mt-2 text-3xl font-black text-vt-text">{tournament.name}</h1>
        </div>
        <div className="rounded-xl border border-vt-border bg-vt-raised px-4 py-2 text-sm text-vt-muted">
          {tournament.category} · {tournament.statusLabel}
        </div>
      </header>

      <nav aria-label="Navegación del torneo" className="rounded-2xl border border-vt-border bg-vt-raised p-2">
        <div className="flex flex-wrap items-center gap-2">
          {tournamentTabs.map((tab) => (
            <Link
              aria-current={tab.suffix === "/stats" ? "page" : undefined}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${tab.suffix === "/stats" ? "bg-vt-accent text-vt-canvas" : "text-vt-muted hover:bg-vt-surface hover:text-vt-text"}`}
              key={tab.label}
              to={`/admin/tournaments/${tournament.id}${tab.suffix}` as string}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>

      <section aria-label="Estadísticas del torneo" className="space-y-4">
        <Card className="border-vt-border bg-vt-raised p-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="mr-6 text-sm font-black text-vt-text">Filtrar estadística</h2>
            {(Object.keys(rankings) as Statistic[]).map((option) => (
              <button
                aria-pressed={statistic === option}
                className={`rounded-full px-8 py-2 text-xs font-black ${statistic === option ? "bg-vt-accent text-vt-canvas" : "bg-vt-panel text-vt-muted hover:text-vt-text"}`}
                key={option}
                onClick={() => setStatistic(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </Card>

        <Card className="border-vt-border bg-vt-raised p-5">
          <h2 className="text-lg font-black text-vt-text">Ranking de Jugadores · {ranking.title}</h2>
          <div className="mt-5 space-y-2">
            {ranking.leaders.map((leader, index) => (
              <article className="flex items-center gap-4 rounded-xl bg-vt-panel px-4 py-4" key={leader.name}>
                <span className={`w-6 text-sm font-black ${index === 0 ? "text-vt-accent" : "text-vt-text"}`}>{index + 1}</span>
                <p className="min-w-0 flex-1 text-sm font-black text-vt-text">{leader.name}</p>
                <p className="w-36 text-xs text-vt-muted">{leader.team}</p>
                <p className={`w-28 text-right text-xl font-black ${index === 0 ? "text-vt-accent" : "text-vt-text"}`}>{leader.value}</p>
              </article>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
