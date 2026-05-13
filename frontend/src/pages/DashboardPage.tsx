import { DASHBOARD_HOME_VM } from "../features/dashboard";
import { DashboardLive } from "../features/dashboard";
import { DashboardRail } from "../features/dashboard";
import { SectionShell } from "../components/ui/SectionShell";

import { Badge } from "../components/ui/Badge";
export function DashboardPage() {
	return (
		<div className="space-y-6">
			<SectionShell
				eyebrow="Admin panel"
				title="VoleyTrack overview"
				description="Live scoreboard, active courts and the admin surfaces that sit above them."
				actions={<Badge tone="accent">Admin mode</Badge>}
			>
				<div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
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
				</div>

			</SectionShell>
		</div>
	);
}
