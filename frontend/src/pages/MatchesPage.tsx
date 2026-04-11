import { SCREEN_ONE_MATCHES_VM } from "../features/screen-one/screen-one.models";
import { ScreenOneMatches } from "../features/screen-one/components/ScreenOneMatches";

export function MatchesPage() {
	return (
		<div className="space-y-6">
			<ScreenOneMatches matchCenter={SCREEN_ONE_MATCHES_VM.matchCenter} />
		</div>
	);
}
