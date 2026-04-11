import { DASHBOARD_HOME_VM } from "../features/dashboard";
import { DashboardLive } from "../features/dashboard";
import { DashboardRail } from "../features/dashboard";
import { SectionShell } from "../components/ui/SectionShell";

export function DashboardPage() {
	return (
		<div className="space-y-6">
			<header className="space-y-2">
				<p className="text-[10px] font-bold uppercase tracking-[0.28em] text-vt-muted">
					Dashboard
				</p>
				<h2 className="text-2xl font-black uppercase tracking-[-0.05em] text-white sm:text-[2rem]">
					VoleyTrack overview
				</h2>
				<p className="max-w-2xl text-sm leading-6 text-vt-muted">
					Live scoreboard, active courts and momentum rails in one browser-first surface.
				</p>
			</header>

			<SectionShell className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
				<div className="min-w-0 space-y-6">
					<section className="space-y-6">
						<DashboardLive
							hero={DASHBOARD_HOME_VM.hero}
							liveMatches={DASHBOARD_HOME_VM.liveMatches}
							spotlight="3 Matches"
						/>
					</section>
				</div>

				<DashboardRail cards={DASHBOARD_HOME_VM.rail} />
			</SectionShell>
		</div>
	);
}
