import { Link, useParams } from "@tanstack/react-router";
import { Card } from "../../components/primitives/Card";
import { PUBLIC_PLAYERS, PUBLIC_TEAMS, type TeamFixture } from "../../fixtures";

const teamTabs = [
  { label: "Resumen", suffix: "" },
  { label: "Plantel", suffix: "/roster" },
  { label: "Partidos", suffix: "/matches" },
  { label: "Estadísticas", suffix: "/stats" },
] as const;

function findTeam(id: string): TeamFixture | undefined {
  return PUBLIC_TEAMS.find((team) => team.id === id);
}

export function TeamDetailPage() {
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

  const roster = PUBLIC_PLAYERS.filter((player) => team.rosterPlayerIds.includes(player.id));

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

      <Card className="border-vt-border bg-vt-raised p-6">
        <h2 className="text-2xl font-black text-vt-text">Resumen del equipo</h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-3">
          <SummaryDetail label="Ciudad" value={team.city} />
          <SummaryDetail label="Categoría" value={team.category} />
          <SummaryDetail label="Entrenador/a" value={team.coach} />
        </dl>
      </Card>

      <nav aria-label="Navegación del equipo" className="rounded-2xl border border-vt-border bg-vt-raised p-2">
        <div className="flex flex-wrap gap-2">
          {teamTabs.map((tab, index) => (
            <Link
              aria-current={index === 0 ? "page" : undefined}
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${index === 0 ? "bg-vt-accent text-vt-canvas" : "text-vt-muted hover:bg-vt-surface hover:text-vt-text"}`}
              key={tab.label}
              to={`/teams/${team.id}${tab.suffix}` as string}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </nav>

      <Card>
        <h2 className="text-xl font-bold text-vt-text">Plantel</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {roster.map((player) => (
            <Link
              className="rounded-xl border border-vt-border bg-vt-panel p-4 transition hover:border-vt-accent"
              key={player.id}
              to={`/players/${player.id}` as string}
            >
              <p className="font-bold text-vt-text">#{player.number} {player.fullName}</p>
              <p className="mt-1 text-sm text-vt-muted">{player.position}</p>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SummaryDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-[0.08em] text-vt-muted">{label}</dt>
      <dd className="mt-1 text-sm text-vt-text">{value}</dd>
    </div>
  );
}
