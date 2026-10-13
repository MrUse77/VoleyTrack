import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	PUBLIC_LIVE_MATCH_DETAILS,
	PUBLIC_PLAYER_DETAILS,
	PUBLIC_PLAYERS,
	PUBLIC_TEAMS,
} from "../../fixtures";
import { PlayerDetailPage } from "./PlayerDetailPage";

let playerId = PUBLIC_PLAYERS[0].id;

vi.mock("@tanstack/react-router", () => ({
	Link: ({ children, to }: { children: ReactNode; to: string }) => (
		<a href={to}>{children}</a>
	),
	useLocation: () => ({ search: {} }),
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

	it("renders the canonical hero with public identity and navigation context", () => {
		const player = PUBLIC_PLAYERS[0];
		const team = PUBLIC_TEAMS.find((item) => item.id === player.teamId)!;
		const detail = PUBLIC_PLAYER_DETAILS.find(
			(item) => item.playerId === player.id,
		)!;
		const html = renderPlayerDetail(player.id);

		expect(html).toContain('data-testid="player-hero"');
		expect(html).toContain('aria-label="Navegación del jugador"');
		expect(html).toContain(player.fullName);
		expect(html).toContain(`>${player.number}<`);
		expect(html).toContain(player.position);
		expect(html).toContain(team.name);
		expect(html).toContain(`href="/teams/${team.id}"`);
		expect(html).toContain(detail.heightLabel);
		expect(html).toContain(detail.weightLabel);
		expect(html).toContain(detail.ageLabel);
	});

	it("renders the four design KPI tiles through the aligned KpiGrid/Kpi primitives", () => {
		const html = renderPlayerDetail();

		expect(html.match(/data-testid="player-kpi"/g)).toHaveLength(4);
		expect(html).toContain('aria-label="Indicadores principales del jugador"');
		expect(html).toContain('role="list"');
		for (const [label, value, sub] of [
			["Puntos", "142", "3.8 / set · 1º del torneo"],
			["Ataque", "49%", "Efectividad"],
			["Bloqueo", "18", "0.5 / set"],
			["Saque ace", "11", "Top 3 liga"],
		] as const) {
			expect(html).toContain(label);
			expect(html).toContain(`>${value}<`);
			expect(html).toContain(sub);
		}
		// Design: voleytrack-jugadores.css:3-10 (.kpi-grid, 4 columns, 2 below 1200px) and the
		// .kpi-value typography (32px/900, line-height 1).
		expect(html).toContain("min-[600px]:grid-cols-2");
		expect(html).toContain("min-[1200px]:grid-cols-4");
		expect(html).toContain("text-[32px]");
		expect(html).toContain("font-black");
	});

	it("renders the canonical statistical hierarchy and visual emphasis", () => {
		const html = renderPlayerDetail();

		expect(html).toContain("Desglose por Fundamento");
		for (const [label, value, width] of [
			["Ataque", "140 pts", "100"],
			["Bloqueo", "42 pts", "32"],
			["Saque", "18 pts", "16"],
			["Defensa (Digs)", "85", "60"],
			["Recepción Perf.", "60%", "80"],
		] as const) {
			expect(html).toContain(label);
			expect(html).toContain(value);
			expect(html).toContain(`aria-valuenow="${width}"`);
		}
	});

	it("renders recent performance context and links only live detail fixtures", () => {
		const detail = PUBLIC_PLAYER_DETAILS[0];
		const liveMatch = detail.recentMatches.find(({ match }) => match.status === "live")!.match;
		const finishedMatch = detail.recentMatches.find(({ match }) => match.status === "finished")!.match;
		const liveDetail = PUBLIC_LIVE_MATCH_DETAILS.find(({ match }) => match === liveMatch);
		const player = PUBLIC_PLAYERS.find(({ id }) => id === detail.playerId)!;
		const expectedScore = liveMatch.homeTeamId === player.teamId
			? `${liveMatch.score!.home} - ${liveMatch.score!.away}`
			: `${liveMatch.score!.away} - ${liveMatch.score!.home}`;
		const html = renderPlayerDetail(detail.playerId);

		expect(html).toContain("Últimos Partidos");
		expect(html).toContain(liveMatch.badgeLabel);
		expect(html).toContain(liveMatch.venue);
		expect(html).toContain(detail.tournamentName);
		expect(html).toContain(expectedScore);
		expect(liveDetail).toBeDefined();
		expect(html).toContain(`href="/matches/${liveMatch.id}/live"`);
		expect(html).not.toContain(`href="/matches/${finishedMatch.id}/live"`);
		expect(html).toContain("22 Pts");
		expect(html).toContain("18 Pts");
		expect(html).toContain("15 Pts");
		expect(html).toContain("25 Pts");
	});

	it("uses the measured desktop content and lower-column geometry with safe stacking", () => {
		const html = renderPlayerDetail();

		expect(html).toContain('data-testid="player-detail-content"');
		expect(html).toContain("max-w-[1104px]");
		expect(html).toContain("min-[1428px]:ml-3");
		expect(html).not.toContain("min-[1416px]:ml-3");
		expect(html).toContain("min-[1416px]:grid-cols-[repeat(2,540px)]");
		expect(html).toContain("min-[1416px]:h-[400px]");

		for (const titleId of [
			"player-stat-breakdown-title",
			"player-recent-matches-title",
		]) {
			const card = html.match(
				new RegExp(`<div[^>]*aria-labelledby="${titleId}"[^>]*>`),
			)?.[0] ?? "";
			expect(card).not.toBe("");
			expect(card).toContain("min-w-0");
		}
	});

	it("renders every existing standalone public player coherently", () => {
		const player = PUBLIC_PLAYERS[1];
		const detail = PUBLIC_PLAYER_DETAILS.find((item) => item.playerId === player.id);
		const html = renderPlayerDetail(player.id);

		expect(detail).toBeDefined();
		expect(html).toContain(player.fullName);
		expect(html).toContain(detail!.heightLabel);
		expect(html).not.toContain(PUBLIC_PLAYERS[0].fullName);
	});

	it("keeps team-local players without standalone fixtures unlinked and honest", () => {
		const html = renderPlayerDetail("mateo-silva");

		expect(PUBLIC_PLAYERS.some(({ id }) => id === "mateo-silva")).toBe(false);
		expect(PUBLIC_PLAYER_DETAILS.some(({ playerId: id }) => id === "mateo-silva")).toBe(false);
		expect(html).toContain("Jugador no encontrado");
		expect(html).toContain('href="/players"');
	});

	it("handles an unknown player", () => {
		const html = renderPlayerDetail("unknown-player");

		expect(html).toContain("Jugador no encontrado");
		expect(html).toContain('href="/players"');
	});
});
