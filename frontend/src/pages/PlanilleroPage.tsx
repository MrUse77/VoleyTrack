import { ClipboardList, Clock3, ClipboardCheck, AlertTriangle, ArrowRight } from "lucide-react";
import { Badge } from "../components/primitives/Badge";
import { Card } from "../components/primitives/Card";
import { PageHeader } from "../components/primitives/PageHeader";

const queue = [
	{ label: "Next to score", detail: "Brazil vs Italy · Set 4", status: "LIVE" },
	{ label: "In review", detail: "USA vs Poland · disputes", status: "CHECK" },
	{ label: "Ready", detail: "France vs Japan · warm-up", status: "SYNC" },
];

function QueueRow({ label, detail, status }: { label: string; detail: string; status: string }) {
	return (
		<div className="flex items-center justify-between gap-3 rounded-2xl border border-vt-border bg-vt-panel px-4 py-3">
			<div>
				<p className="text-sm font-semibold text-white">{label}</p>
				<p className="text-xs text-vt-muted">{detail}</p>
			</div>
			<Badge tone={status === "LIVE" ? "success" : "muted"}>{status}</Badge>
		</div>
	);
}

function MetricCard({ label, value, hint }: { label: string; value: string; hint: string }) {
	return (
		<div className="rounded-[18px] border border-vt-border bg-vt-panel p-4">
			<p className="text-[10px] font-bold uppercase tracking-[0.24em] text-vt-muted">{hint}</p>
			<p className="mt-2 text-3xl font-black tracking-[-0.05em] text-white">{value}</p>
			<p className="mt-1 text-sm text-vt-muted">{label}</p>
		</div>
	);
}

export function PlanilleroPage() {
	return (
		<section className="space-y-6">
			<PageHeader
				title="Scorekeeper control room"
				description="Fast entry for live scoring, incidents and match handoff."
				actions={
					<>
						<Badge tone="muted">Planillero panel</Badge>
						<Badge tone="accent">Operator mode</Badge>
					</>
				}
			/>
			<div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
				<Card className="p-5 sm:p-6" padded={false}>
					<div className="space-y-5">
						<div className="flex flex-wrap items-center gap-2">
							<Badge tone="accent">Live scoring</Badge>
							<Badge tone="muted">Set sheet</Badge>
							<Badge tone="muted">Incidents</Badge>
						</div>

						<div className="grid gap-4 sm:grid-cols-3">
							<MetricCard label="Brazil" value="24" hint="Home" />
							<MetricCard label="Set 4" value="4" hint="Current" />
							<MetricCard label="Italy" value="22" hint="Away" />
						</div>

						<div className="grid gap-3 sm:grid-cols-2">
							<button className="rounded-2xl bg-vt-accent px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#ff9b59]" type="button">
								Open score sheet
							</button>
							<button className="inline-flex items-center justify-center gap-2 rounded-2xl border border-vt-border bg-vt-panel px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:border-vt-accent/30" type="button">
								Log incident
								<AlertTriangle className="h-4 w-4" />
							</button>
						</div>
					</div>
				</Card>

				<div className="grid gap-4">
					<Card className="p-4 sm:p-5" padded={false}>
						<div className="flex items-start justify-between gap-4">
							<div className="space-y-3">
								<div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-vt-border bg-vt-panel text-vt-accent">
									<ClipboardList className="h-5 w-5" />
								</div>
								<div className="space-y-1">
									<h3 className="text-lg font-bold uppercase tracking-[-0.04em] text-white">
										Match queue
									</h3>
									<p className="max-w-md text-sm leading-6 text-vt-muted">
										The next matches the operator needs to shepherd from warm-up to live.
									</p>
								</div>
							</div>
							<Badge tone="muted" className="shrink-0">3 queued</Badge>
						</div>
						<div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-vt-border bg-vt-panel px-4 py-3 text-sm text-vt-text/80">
							<span>Open the current sheet and confirm rotations.</span>
							<ArrowRight className="h-4 w-4 text-vt-accent" />
						</div>
					</Card>

					<Card className="p-4" padded={false}>
						<div className="space-y-3">
							<p className="text-[10px] font-bold uppercase tracking-[0.28em] text-vt-muted">Queue status</p>
							{queue.map((item) => (
								<QueueRow key={item.label} {...item} />
							))}
						</div>
					</Card>

					<Card className="grid gap-3 p-4 sm:grid-cols-3" padded={false}>
						<div className="rounded-2xl border border-vt-border bg-vt-panel p-4">
							<Clock3 className="h-5 w-5 text-vt-accent" />
							<p className="mt-3 text-sm font-semibold text-white">Timing checks</p>
							<p className="mt-1 text-xs text-vt-muted">Service timer and substitutions</p>
						</div>
						<div className="rounded-2xl border border-vt-border bg-vt-panel p-4">
							<ClipboardCheck className="h-5 w-5 text-vt-accent" />
							<p className="mt-3 text-sm font-semibold text-white">Sheet sync</p>
							<p className="mt-1 text-xs text-vt-muted">Confirmed by referee table</p>
						</div>
						<div className="rounded-2xl border border-vt-border bg-vt-panel p-4">
							<AlertTriangle className="h-5 w-5 text-vt-accent" />
							<p className="mt-3 text-sm font-semibold text-white">Incident log</p>
							<p className="mt-1 text-xs text-vt-muted">Cards, disputes, and pauses</p>
						</div>
					</Card>
				</div>
			</div>
		</section>
	);
}
