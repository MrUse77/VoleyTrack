import type { DashboardHomeVm } from "../dashboard.models";
import { Badge } from "../../../components/ui/Badge";
import { SectionShell } from "../../../components/ui/SectionShell";
import { Surface } from "../../../components/ui/Surface";
import { DashboardHero } from "./DashboardHero";

interface DashboardLiveProps {
  hero: DashboardHomeVm["hero"];
  liveMatches: DashboardHomeVm["liveMatches"];
  spotlight: string;
}

export function DashboardLive({ hero, liveMatches, spotlight }: DashboardLiveProps) {
  return (
    <section className="space-y-5">
      <DashboardHero hero={hero} spotlight={spotlight} />

      <SectionShell
        eyebrow="Live matches"
        title="Preview of the active courts"
        actions={
          <a className="text-xs font-bold uppercase tracking-[0.16em] text-vt-accent hover:underline" href="#">
            Ver más
          </a>
        }
      >
        <div className="space-y-3">
          {liveMatches.slice(0, 4).map((match) => (
            <Surface
              key={`${match.league}${match.teams[0]}${match.teams[1]}`}
              className="p-4 transition hover:border-vt-accent/30 hover:bg-white/5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.26em] text-vt-muted">
                      {match.league}
                    </span>
                    <Badge tone="muted" className="px-2 py-1 text-[10px] tracking-[0.18em]">
                      Match
                    </Badge>
                  </div>
                  <p className="text-base font-semibold text-white">
                    {match.teams[0]} <span className="text-vt-muted">vs</span> {match.teams[1]}
                  </p>
                  <p className="text-sm text-vt-muted">{match.status}</p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-black text-white">{match.score}</p>
                  <Badge tone="accent" className="mt-1 px-2 py-1 text-[10px] tracking-[0.22em]">
                    {match.stage}
                  </Badge>
                </div>
              </div>
            </Surface>
          ))}
        </div>
        <p className="sr-only">
          Preview shows the main live match plus 3 more live matches.
        </p>
      </SectionShell>
    </section>
  );
}
