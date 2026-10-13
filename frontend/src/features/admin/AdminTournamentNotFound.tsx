import { Link } from "@tanstack/react-router";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { Card } from "../../components/primitives/Card";
import { EmptyState } from "../../components/primitives/EmptyState";

/**
 * The unknown-id fallback for every admin tournament route, in one place so the five copies of
 * the old inline "Torneo no encontrado" card cannot drift.
 *
 * The design has no counterpart: its prototype always resolves the tournament it links to.
 * `EmptyState` is the app's announced `role="status"` block, and the way back points at the
 * admin list, which is the screen that owns the id.
 */
export function AdminTournamentNotFound() {
  return (
    <Card padded={false}>
      <EmptyState
        description="El torneo que buscás no está disponible en la administración."
        title="Torneo no encontrado"
      />
      <div className="px-5 pb-[18px]">
        <Link className={buttonClasses("ghost")} to={"/admin/tournaments" as string}>
          ← Volver a torneos
        </Link>
      </div>
    </Card>
  );
}
