import { useParams } from "@tanstack/react-router";
import { Card } from "../../components/primitives/Card";
import {
  findTeamJourney,
  TeamJourney,
  TeamNotFound,
  TeamPlayerName,
  teamRosterRows,
} from "./TeamJourney";

export function TeamRosterPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const context = findTeamJourney(id);

  if (!context) return <TeamNotFound />;

  const roster = teamRosterRows(context);

  return (
    <TeamJourney activeTab="roster" {...context}>
      <section aria-labelledby="team-roster-title">
        <h2 className="mb-4 text-lg font-bold leading-6 text-vt-accent" id="team-roster-title">Plantel Completo</h2>
        <Card
          className="overflow-hidden p-0 min-[1416px]:h-[520px]"
          data-testid="team-roster-panel"
        >
          {roster.length > 0 ? (
            <div className="overflow-x-auto" data-testid="team-roster-table">
              <table className="w-full min-w-[920px] table-fixed border-collapse text-left min-[1416px]:min-w-[1104px]">
                <colgroup data-testid="team-roster-columns">
                  <col className="w-[242px]" />
                  <col className="w-[190px]" />
                  <col className="w-[100px]" />
                  <col className="w-[150px]" />
                  <col className="w-[150px]" />
                  <col className="w-[150px]" />
                  <col className="w-[122px]" />
                </colgroup>
                <thead className="bg-vt-panel">
                  <tr className="h-10 text-[11px] tracking-[0.08em] text-vt-muted">
                    <th className="px-[18px] font-bold" scope="col">JUGADOR</th>
                    <th className="px-4 font-bold" scope="col">POSICIÓN</th>
                    <th className="px-4 text-right font-bold" scope="col">#</th>
                    <th className="px-4 text-right font-bold" scope="col">PUNTOS</th>
                    <th className="px-4 text-right font-bold" scope="col">ATAQUES</th>
                    <th className="px-4 text-right font-bold" scope="col">BLOQUEOS</th>
                    <th className="px-[18px] text-right font-bold" scope="col">SAQUES</th>
                  </tr>
                </thead>
                <tbody>
                  {roster.map(({ player, stats }) => (
                    <tr className="h-[50px] border-t border-vt-border text-sm" key={player.id}>
                      <th className="px-[18px] font-black" scope="row">
                        <TeamPlayerName
                          className="text-vt-text"
                          player={player}
                        />
                      </th>
                      <td className="px-4 text-vt-muted">{player.position}</td>
                      <td className="px-4 text-right text-vt-muted">{player.number}</td>
                      <td className="px-4 text-right font-black text-vt-text">{stats?.points ?? "—"}</td>
                      <td className="px-4 text-right text-vt-text">{stats?.attacks ?? "—"}</td>
                      <td className="px-4 text-right text-vt-text">{stats?.blocks ?? "—"}</td>
                      <td className="px-[18px] text-right text-vt-text">{stats?.aces ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-6 text-sm text-vt-muted">No hay jugadores registrados para este equipo.</p>
          )}
        </Card>
      </section>
    </TeamJourney>
  );
}
