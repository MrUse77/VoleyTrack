import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PUBLIC_PLAYERS, PUBLIC_TEAMS } from "../../fixtures";
import { PlayerDetailPage } from "./PlayerDetailPage";

let playerId = PUBLIC_PLAYERS[0].id;

vi.mock("@tanstack/react-router", () => ({
	Link: ({ children, to }: { children: ReactNode; to: string }) => (
		<a href={to}>{children}</a>
	),
	useParams: () => ({ id: playerId }),
}));

function renderPlayerDetail(id = PUBLIC_PLAYERS[0].id) {
	playerId = id;
	return renderToStaticMarkup(<PlayerDetailPage />);
}

describe("public player detail", () => {
	beforeEach(() => {
		playerId = PUBLIC_PLAYERS[0].id;
	});

	it("renders selected player context (name, number, position, team, bio)", () => {
		const player = PUBLIC_PLAYERS[0];
		const team = PUBLIC_TEAMS.find((t) => t.id === player.teamId);
		const html = renderPlayerDetail(player.id);

		expect(html).toContain(player.fullName);
		expect(html).toContain(String(player.number));
		expect(html).toContain(player.position);
		expect(html).toContain(team!.name);
		expect(html).toContain(player.bio);
	});

	it("renders an alternate player", () => {
		const player = PUBLIC_PLAYERS[1];
		const html = renderPlayerDetail(player.id);

		expect(html).toContain(player.fullName);
		expect(html).not.toContain(PUBLIC_PLAYERS[0].fullName);
	});

	it("handles an unknown player", () => {
		const html = renderPlayerDetail("unknown-player");

		expect(html).toContain("Jugador no encontrado");
		expect(html).toContain('href="/players"');
	});
});
