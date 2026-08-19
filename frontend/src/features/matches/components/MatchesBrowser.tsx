import type { MatchesBrowserVm } from "../matches.models";
import { useMatchCenterFilter } from "../hooks/use-match-center-filter";
import { Badge } from "../../../components/ui/Badge";
import { Surface } from "../../../components/ui/Surface";

interface MatchesBrowserProps {
	matchCenter: MatchesBrowserVm;
}

export function MatchesBrowser({ matchCenter }: MatchesBrowserProps) {
	const { normalizeFilter, visibleSections, isActive, setFilter } =
		useMatchCenterFilter(matchCenter);

	return (
		<section className="space-y-6">

			<div className="flex flex-wrap gap-2">
				{matchCenter.filters.map((filter) => {
					const filterLabel = normalizeFilter(filter.label);
					const active = isActive(filterLabel);

					return (
						<button
							key={filter.label}
							className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] transition ${active ? "border-vt-accent bg-vt-accent/10 text-white" : "border-vt-border bg-vt-panel text-vt-muted hover:text-white"}`}
							aria-current={active ? "page" : undefined}
							type="button"
							onClick={() => setFilter(filterLabel)}
						>
							{filterLabel}
						</button>
					);
				})}
			</div>

			<div className="space-y-6">
				{visibleSections.map((section) => (
					<Surface key={section.category} className="p-4 sm:p-5">
						<div className="flex items-center justify-between gap-3 border-b border-vt-border pb-3">
							<div>
								<p className="text-[10px] font-bold uppercase tracking-[0.28em] text-vt-muted">
									{section.title}
								</p>
							</div>
						</div>

						{section.items.length === 0 ? (
							<div className="mt-4 rounded-2xl border border-dashed border-vt-border bg-vt-panel px-4 py-8 text-sm text-vt-muted">
								{section.emptyState}
							</div>
						) : (
							<div className="mt-4 space-y-3">
								{section.items.map((match) => (
									<article
										key={`${match.league}${match.teams[0]}${match.teams[1]}`}
										className="rounded-2xl border border-vt-border bg-vt-panel p-4 transition hover:border-vt-accent/30 hover:bg-vt-panel"
									>
										<div className="flex items-start justify-between gap-4">
											<div className="min-w-0 space-y-2">
												<div className="flex flex-wrap items-center gap-2">
													<span className="text-[10px] uppercase tracking-[0.26em] text-vt-muted">
														{match.league}
													</span>
													<Badge tone="muted" className="px-2 py-1 text-[10px] tracking-[0.18em]">
														{section.category}
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
									</article>
								))}
							</div>
						)}
					</Surface>
				))}
			</div>
		</section>
	);
}
