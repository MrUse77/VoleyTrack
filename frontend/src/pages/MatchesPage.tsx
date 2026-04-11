import { Surface } from "../components/ui/Surface";
import { MATCHES_BROWSER_VM, MatchesBrowser } from "../features/matches";

export function MatchesPage() {
	return (
		<div className="space-y-6">
			<Surface className="p-3 sm:p-4">
				<header className="space-y-2">
					<p className="text-[10px] font-bold uppercase tracking-[0.28em] text-vt-muted">
						Matches
					</p>
					<h2 className="text-2xl font-black uppercase tracking-[-0.05em] text-white sm:text-[2rem]">
						Match center
					</h2>
					<p className="max-w-2xl text-sm leading-6 text-vt-muted">
						Browse live, upcoming and final matches in a consistent browser layout.
					</p>
				</header>
			</Surface >


			<MatchesBrowser matchCenter={MATCHES_BROWSER_VM} />
		</div>
	);
}
