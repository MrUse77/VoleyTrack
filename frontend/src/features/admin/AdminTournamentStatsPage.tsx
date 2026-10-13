import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { Filter, FilterGroup } from "../../components/primitives/FilterGroup";
import { Num } from "../../components/primitives/Num";
import { TournamentPanelHeader } from "../public/TournamentDetailShell";
import { AdminTournamentNotFound } from "./AdminTournamentNotFound";
import { AdminTournamentShell } from "./AdminTournamentShell";
import { findAdminTournament } from "./adminTournamentLookup";

type Statistic = "Puntos" | "Ataques" | "Bloqueos";

type Leader = {
  name: string;
  team: string;
  value: string;
};

/**
 * The admin tournament's `Estadísticas` tab.
 *
 * Design: the design's own statistics card is the public tournament detail's (there is no
 * statistics screen in the admin set — `voleytrack-admin-ver-torneo.html` ends at its
 * `Próximos partidos` card), so this panel keeps the app's existing content on the app's
 * existing primitives: the `.filters` pill row is `FilterGroup`/`Filter` (aria-pressed, so the
 * selection is announced rather than only painted), the rank is the row's own number — never
 * colour alone — and the figures carry the design's `.num` treatment through `Num`.
 *
 * PROTOTYPE DATA — NOT REAL: these three leaderboards were literals in this screen before the
 * alignment and are still local constants; they must be replaced by the tournament's real
 * statistics.
 */
const rankings = Object.freeze({
  Puntos: {
    title: "Puntos Totales",
    leaders: [
      { name: "Mateo Silva", team: "River Plate", value: "128 pts" },
      { name: "Bruno Herrera", team: "Ciudad Voley", value: "119 pts" },
      { name: "Julián Acosta", team: "UPCN San Juan", value: "104 pts" },
      { name: "Tomás Núñez", team: "Boca Juniors", value: "96 pts" },
    ],
  },
  Ataques: {
    title: "Ataques Totales",
    leaders: [
      { name: "Mateo Silva", team: "River Plate", value: "82 ataques" },
      { name: "Julián Acosta", team: "UPCN San Juan", value: "76 ataques" },
      { name: "Bruno Herrera", team: "Ciudad Voley", value: "71 ataques" },
      { name: "Tomás Núñez", team: "Boca Juniors", value: "64 ataques" },
    ],
  },
  Bloqueos: {
    title: "Bloqueos Totales",
    leaders: [
      { name: "Tomás Núñez", team: "Boca Juniors", value: "24 bloqueos" },
      { name: "Julián Acosta", team: "UPCN San Juan", value: "21 bloqueos" },
      { name: "Mateo Silva", team: "River Plate", value: "18 bloqueos" },
      { name: "Bruno Herrera", team: "Ciudad Voley", value: "16 bloqueos" },
    ],
  },
} satisfies Readonly<Record<Statistic, { title: string; leaders: readonly Leader[] }>>);

export function AdminTournamentStatsPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const tournament = findAdminTournament(id);
  const [statistic, setStatistic] = useState<Statistic>("Puntos");

  if (!tournament) return <AdminTournamentNotFound />;

  const ranking = rankings[statistic];

  return (
    <AdminTournamentShell activeTab="estadisticas" tournament={tournament}>
      <TournamentPanelHeader eyebrow="JUGADORES">
        Ranking de Jugadores · {ranking.title}
      </TournamentPanelHeader>

      <div className="px-[18px] pt-4">
        <FilterGroup aria-label="Filtrar estadística">
          {(Object.keys(rankings) as Statistic[]).map((option) => (
            <Filter
              isActive={statistic === option}
              key={option}
              onClick={() => setStatistic(option)}
            >
              {option}
            </Filter>
          ))}
        </FilterGroup>
      </div>

      <ul className="grid list-none gap-2 px-[18px] pt-4 pb-[18px]">
        {ranking.leaders.map((leader, index) => (
          <li
            className="flex items-center gap-4 rounded-[10px] border border-vt-border-2 bg-vt-surface-2 px-4 py-4"
            key={leader.name}
          >
            <Num className="w-6 text-[14px] font-black text-vt-text">{index + 1}</Num>
            <p className="min-w-0 flex-1 text-[14px] font-black text-vt-text">{leader.name}</p>
            <p className="w-36 text-[12px] text-vt-muted">{leader.team}</p>
            <Num className="w-28 text-[20px] font-black text-vt-accent">{leader.value}</Num>
          </li>
        ))}
      </ul>
    </AdminTournamentShell>
  );
}
