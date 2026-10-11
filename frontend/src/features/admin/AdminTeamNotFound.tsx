import { Link } from "@tanstack/react-router";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { Card } from "../../components/primitives/Card";
import { EmptyState } from "../../components/primitives/EmptyState";

/**
 * The unknown-id fallback for every admin team route, in one place so the four copies of the
 * old inline "Equipo no encontrado" card cannot drift.
 *
 * The design has no counterpart: its prototype always resolves the team it links to.
 * `EmptyState` is the app's announced `role="status"` block, and the way back points at the
 * admin list, which is the screen that owns the id.
 */
export function AdminTeamNotFound() {
  return (
    <Card padded={false}>
      <EmptyState
        description="El equipo que buscás no está disponible en la administración."
        title="Equipo no encontrado"
      />
      <div className="px-5 pb-[18px]">
        <Link className={buttonClasses("ghost")} to={"/admin/teams" as string}>
          ← Volver a equipos
        </Link>
      </div>
    </Card>
  );
}
