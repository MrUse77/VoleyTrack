import {
	SCREEN_ONE_DASHBOARD_VM,
} from "../features/screen-one/screen-one.models";
import { ScreenOneLive } from "../features/screen-one/components/ScreenOneLive";
import { ScreenOneRail } from "../features/screen-one/components/ScreenOneRail";
import { SectionShell } from "../components/ui/SectionShell";

export function DashboardPage() {
	return (
		<SectionShell
			className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]"
		>
			<div className="min-w-0 space-y-6">
				<section className="space-y-6">
					<ScreenOneLive
						hero={SCREEN_ONE_DASHBOARD_VM.hero}
						liveMatches={SCREEN_ONE_DASHBOARD_VM.liveMatches}
						utility={SCREEN_ONE_DASHBOARD_VM.utility}
					/>
				</section>
			</div>

			<ScreenOneRail cards={SCREEN_ONE_DASHBOARD_VM.rail} />
		</SectionShell>
	);
}
