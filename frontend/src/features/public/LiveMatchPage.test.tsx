import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_MATCHES } from "../../fixtures";
import { LiveMatchPage } from "./LiveMatchPage";

let matchId = PUBLIC_MATCHES.live[0].id;

vi.mock("@tanstack/react-router", () => ({
	Link: ({ children, to }: { children: ReactNode; to: string }) => (
		<a href={to}>{children}</a>
	),
	useParams: () => ({ id: matchId }),
}));

function renderLiveMatch(id = PUBLIC_MATCHES.live[0].id) {
	matchId = id;
	return renderToStaticMarkup(<LiveMatchPage />);
}

describe("public live match detail", () => {
	beforeEach(() => {
		matchId = PUBLIC_MATCHES.live[0].id;
	});

	it("renders selected match context: teams, score, venue, scheduled label", () => {
		const match = PUBLIC_MATCHES.live[0];
		const html = renderLiveMatch(match.id);

		expect(html).toContain(match.homeTeamName);
		expect(html).toContain(match.awayTeamName);
		expect(html).toContain(match.venue);
		expect(html).toContain(match.scheduledLabel);
		expect(html).toContain(String(match.score!.home));
		expect(html).toContain(String(match.score!.away));
	});

	it("renders a live badge when match status is live", () => {
		const match = PUBLIC_MATCHES.live[0];
		const html = renderLiveMatch(match.id);

		expect(html).toContain(match.badgeLabel);
	});

	it("renders an unknown-match fallback", () => {
		const html = renderLiveMatch("unknown-match");

		expect(html).toContain("Partido no encontrado");
		expect(html).toContain('href="/matches"');
	});
});
