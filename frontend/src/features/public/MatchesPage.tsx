import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Badge } from "../../components/primitives/Badge";
import { Card } from "../../components/primitives/Card";
import { PageHeader } from "../../components/primitives/PageHeader";
import { TabBar } from "../../components/primitives/TabBar";
import { PUBLIC_MATCHES, type MatchFixture, type MatchStatus } from "../../fixtures";

type MatchesFilter = "all" | MatchStatus;

const filterTabs = [
  { label: "Todos", value: "all" },
  { label: "En vivo", value: "live" },
  { label: "Hoy", value: "today" },
  { label: "Próximos", value: "upcoming" },
  { label: "Finalizados", value: "finished" },
] as const;

const filterCards = [
  { detail: "Jugándose", label: "EN VIVO", status: "live", value: "12" },
  { detail: "Partidos de hoy", label: "HOY", status: "today", value: "24" },
  { detail: "Por empezar", label: "PRÓXIMOS", status: "upcoming", value: "8" },
  { detail: "Terminados", label: "FINALIZ.", status: "finished", value: "32" },
] as const;

const badgeVariants = {
  finished: "default",
  live: "success",
  today: "accent",
  upcoming: "default",
} as const;

function matchFilter(value: unknown): MatchesFilter {
  return value === "live" || value === "today" || value === "upcoming" || value === "finished"
    ? value
    : "all";
}

function visibleMatches(status: MatchesFilter): readonly MatchFixture[] {
  return status === "all"
    ? [...PUBLIC_MATCHES.live, ...PUBLIC_MATCHES.today, ...PUBLIC_MATCHES.upcoming, ...PUBLIC_MATCHES.finished]
    : PUBLIC_MATCHES[status];
}

export function MatchesPage() {
  const location = useLocation() as { search: Record<string, unknown> };
  const [status, setStatus] = useState<MatchesFilter>(() => matchFilter(location.search.status));
  const matches = visibleMatches(status);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Partidos"
        description="Explorá partidos en vivo, próximos encuentros y resultados finalizados."
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
                  <p className={filter.status === "live" ? "text-xs font-bold text-vt-success" : "text-xs font-bold text-vt-muted"}>{filter.detail}</p>
                </div>

              </Card>
            </button>
          );
        })}
      </section>

      <TabBar
        aria-label="Filtrar partidos por estado"
        onChange={(value) => setStatus(matchFilter(value))}
        tabs={[...filterTabs]}
        value={status}
      />

      <section aria-label="Lista de partidos" className="space-y-4">
        {matches.map((match) => (
          <Card data-testid="public-match-card" key={match.id} className="border-vt-border bg-vt-surface p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Badge variant={badgeVariants[match.status]}>{match.badgeLabel}</Badge>
                <p className="mt-4 text-lg font-bold text-vt-text">{match.homeTeamName} vs {match.awayTeamName}</p>
                <p className="mt-2 text-sm text-vt-muted">{match.scheduledLabel} · {match.venue}</p>
              </div>
              {match.score ? <p className="rounded-xl bg-vt-panel px-4 py-2 text-xl font-bold text-vt-accent">{match.score.home} - {match.score.away}</p> : null}
            </div>
            <Link className="mt-4 inline-block text-sm font-semibold text-vt-accent" to={`/matches/${match.id}/live` as string}>Ver detalle →</Link>
          </Card>
        ))}
      </section>
    </div>
  );
}
