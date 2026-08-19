import type { DashboardHeroVm } from "../dashboard.models";
import { Badge } from "../../../components/ui/Badge";
import { Surface } from "../../../components/ui/Surface";

interface DashboardHeroProps {
  hero: DashboardHeroVm;
  spotlight: string;
}

export function DashboardHero({ hero, spotlight }: DashboardHeroProps) {
  return (
    <Surface className="overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.95fr)]">
        <div className="relative min-h-[340px] bg-gradient-to-br from-slate-900 via-vt-surface to-slate-950 p-5 sm:p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,140,66,0.16),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.02),transparent_70%)]" />
          <div className="relative flex h-full flex-col justify-between gap-8">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <img
                  src="/icon.svg"
                  alt="VOLLEYTRACK"
                  width="25"
                  height="25"
                  className="shrink-0"
                />
                <Badge tone="accent" className="px-3 py-1 text-[10px] tracking-[0.28em]">
                  Partido principal
                </Badge>
              </div>
              <Badge tone="muted" className="px-3 py-1 text-[11px] tracking-[0.18em]">
                {spotlight}
              </Badge>
            </div>

            <div className="max-w-2xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-vt-accent">
                {hero.liveLabel}
              </p>
              <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-[3.35rem]">
                {hero.title}
              </h2>
              <p className="max-w-2xl text-sm leading-6 text-vt-text/80 sm:text-base">
                {hero.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                className="inline-flex h-9 items-center justify-center rounded-md bg-vt-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-vt-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vt-accent focus-visible:ring-offset-2 focus-visible:ring-offset-vt-surface"
                type="button"
              >
                {hero.ctaLabel}
              </button>
              <Badge tone="neutral" className="rounded-md px-3 py-2 text-xs tracking-[0.12em]">
                {hero.tag} · {hero.ctaLabel}
              </Badge>
            </div>
          </div>
        </div>

        <aside className="w-full border-t border-vt-border bg-vt-panel p-5 lg:border-l lg:border-t-0">
          <div className="flex h-full flex-col justify-between gap-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-vt-muted">
                    Live match
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-white">
                    {hero.setLabel}
                  </h3>
                </div>
                <Badge tone="success">Match point</Badge>
              </div>

              <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-xl border border-vt-border bg-vt-panel p-4">
                <div>
                  <p className="text-sm text-vt-muted">{hero.homeTeam}</p>
                  <p className="text-5xl font-black text-white">{hero.homeScore}</p>
                </div>
                <div className="text-center text-vt-muted">
                  <p className="text-xs uppercase tracking-[0.24em]">Set</p>
                  <p className="text-2xl font-black text-vt-accent">:</p>
                  <p className="text-xs uppercase tracking-[0.24em]">Live</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-vt-muted">{hero.awayTeam}</p>
                  <p className="text-5xl font-black text-white">{hero.awayScore}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-2 text-xs text-vt-text/80">
              {hero.setScores.map((setScore) => (
                <div key={setScore} className="rounded-lg border border-vt-border bg-vt-panel px-3 py-2">
                  {setScore}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </Surface>
  );
}
