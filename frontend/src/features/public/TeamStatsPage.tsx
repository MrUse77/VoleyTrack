import { Link, useParams } from "@tanstack/react-router";
import { Card } from "../../components/primitives/Card";
import { PUBLIC_TEAMS, type TeamFixture } from "../../fixtures";

const teamTabs = [
  { label: "Resumen", suffix: "" },
  { label: "Plantel", suffix: "/roster" },
  { label: "Partidos", suffix: "/matches" },
  { label: "Estadísticas", suffix: "/stats" },
] as const;

type StatCard = {
  label: string;
  value: string;
};

const teamStats = Object.freeze([
  { label: "Partidos jugados", value: "9" },
  { label: "Victorias", value: "6" },
  { label: "Derrotas", value: "3" },
  { label: "Sets ganados", value: "21" },
  { label: "Sets perdidos", value: "14" },
  { label: "Puntos a favor", value: "742" },
] satisfies readonly StatCard[]);

function findTeam(id: string): TeamFixture | undefined {
  return PUBLIC_TEAMS.find((team) => team.id === id);
}

export function TeamStatsPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const team = findTeam(id);

  if (!team) {
    return (
      <Card>
        <h1 className="text-2xl font-bold text-vt-text">Equipo no encontrado</h1>
        <Link className="mt-4 inline-block text-sm font-semibold text-vt-accent" to={"/teams" as string}>
          ← Volver a equipos
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <Link className="text-sm font-semibold text-vt-accent" to={"/teams" as string}>
          ← Equipos
        </Link>
        <p className="mt-5 text-sm text-vt-muted">Equipos / {team.name}</p>
        <h1 className="mt-2 text-3xl font-black text-vt-text">{team.name}</h1>
        <p className="mt-2 text-sm text-vt-muted">{team.city} · {team.category}</p>
      </header>

      <nav aria-label="Navegación del equipo" className="rounded-2xl border border-vt-border bg-vt-raised p-2">
        <div className="flex flex-wrap gap-2">
          {teamTabs.map((tab) => {
            const isActive = tab.suffix === "/stats";
            return (
              <Link
                aria-current={isActive ? "page" : undefined}
                className={`rounded-xl px-4 py-2 text-sm font-semibold ${isActive ? "bg-vt-accent text-vt-canvas" : "text-vt-muted hover:bg-vt-surface hover:text-vt-text"}`}
                key={tab.label}
                to={`/teams/${team.id}${tab.suffix}` as string}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <Card>
        <h2 className="text-xl font-bold text-vt-accent">Estadísticas del equipo</h2>
        <p className="mt-2 text-sm text-vt-muted">Temporada regular · {team.city} · {team.category}</p>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teamStats.map((stat) => (
            <StatTile key={stat.label} stat={stat} />
          ))}
        </dl>
      </Card>
    </div>
  );
}

function StatTile({ stat }: { stat: StatCard }) {
  return (
    <div className="rounded-xl border border-vt-border bg-vt-panel p-4">
      <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-vt-muted">{stat.label}</dt>
      <dd className="mt-2 text-2xl font-black text-vt-text">{stat.value}</dd>
    </div>
  );
}
