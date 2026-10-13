import { LayoutDashboard, Shield, Users, Volleyball } from "lucide-react";
import { Badge } from "../components/primitives/Badge";
import { Card } from "../components/primitives/Card";

const adminCards = [
	{
		title: "Competition ops",
		description: "Broadcast-facing dashboard for the current day, live matches and feed health.",
		meta: "Route: /admin",
		icon: <LayoutDashboard className="h-5 w-5" />,
		action: "Prioritize score visibility and live coverage.",
	},
	{
		title: "Roster control",
		description: "Players and teams should be browsed, curated and verified from here.",
		meta: "Players + Teams",
		icon: <Users className="h-5 w-5" />,
		action: "Use this surface for roster and identity cleanup.",
	},
	{
		title: "Results and stats",
		description: "Finals, recaps and aggregate stats belong here as read-first analytical views.",
		meta: "Results + Stats",
		icon: <Volleyball className="h-5 w-5" />,
		action: "Push deeper analytics into dedicated drill-down pages.",
	},
	{
		title: "Admin oversight",
		description: "Moderation, publishing and cross-surface permissions stay on the admin rail.",
		meta: "Control",
		icon: <Shield className="h-5 w-5" />,
		action: "Keep the operator panel separate from publishing rights.",
	},
];

export function AdminPage() {
	return (
		<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
			{adminCards.map((card) => (
				<Card key={card.title} className="p-4 sm:p-5" padded={false}>
					<div className="flex items-start justify-between gap-4">
						<div className="space-y-3">
							<div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-vt-border bg-vt-panel text-vt-accent">
								{card.icon}
							</div>
							<div className="space-y-1">
								<h3 className="text-lg font-bold uppercase tracking-[-0.04em] text-vt-text">{card.title}</h3>
								<p className="max-w-md text-sm leading-6 text-vt-muted">{card.description}</p>
							</div>
						</div>
						<Badge tone="muted" className="shrink-0">{card.meta}</Badge>
					</div>
					<div className="mt-4 rounded-2xl border border-vt-border bg-vt-panel px-4 py-3 text-sm text-vt-text/80">
						{card.action}
					</div>
				</Card>
			))}
		</div>
	);
}
