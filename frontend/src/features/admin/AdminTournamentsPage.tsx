import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "../../components/primitives/Badge";
import { Button } from "../../components/primitives/Button";
import { DataTable, type DataTableColumn } from "../../components/primitives/DataTable";
import { PageHeader } from "../../components/primitives/PageHeader";
import { ADMIN, type AdminTournamentFixture } from "../../fixtures";

const statusVariants = {
  finished: "default",
  "in-progress": "success",
  upcoming: "accent",
} as const;

type LocalAction = "view" | "edit";

type AdminRowActionsProps = {
  entityLabel: string;
  onLocalAction: (action: LocalAction) => void;
  onRemove: () => void;
};

function AdminRowActions({ entityLabel, onLocalAction, onRemove }: AdminRowActionsProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  if (isConfirming) {
    return (
      <div
        aria-label={`Confirmación para eliminar ${entityLabel}`}
        className="flex flex-wrap items-center gap-2"
        role="group"
      >
        <span className="text-xs text-vt-muted">¿Eliminar {entityLabel} solo de esta vista?</span>
        <Button
          aria-label={`Confirmar eliminación de ${entityLabel}`}
          className="h-9 text-xs text-vt-danger hover:bg-vt-danger/10"
          onClick={() => {
            setIsConfirming(false);
            onRemove();
          }}
          variant="ghost"
        >
          Confirmar
        </Button>
        <Button
          aria-label={`Cancelar eliminación de ${entityLabel}`}
          className="h-9 text-xs"
          onClick={() => setIsConfirming(false)}
          variant="ghost"
        >
          Cancelar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        aria-label={`Ver ${entityLabel}`}
        className="h-9 text-xs"
        onClick={() => onLocalAction("view")}
        variant="ghost"
      >
        Ver
      </Button>
      <Button
        aria-label={`Editar ${entityLabel}`}
        className="h-9 text-xs"
        onClick={() => onLocalAction("edit")}
        variant="ghost"
      >
        ✏️ Editar
      </Button>
      <Button
        aria-label={`Eliminar ${entityLabel}`}
        className="h-9 text-xs text-vt-danger hover:bg-vt-danger/10"
        onClick={() => setIsConfirming(true)}
        variant="ghost"
      >
        🗑️ Borrar
      </Button>
    </div>
  );
}

export function AdminTournamentsPage() {
  const [removedTournamentIds, setRemovedTournamentIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const tournaments = ADMIN.tournaments.filter((tournament) => !removedTournamentIds.includes(tournament.id));

  const columns: DataTableColumn<AdminTournamentFixture>[] = [
    { header: "Torneo", key: "name" },
    { header: "Categoría", key: "category" },
    {
      header: "Estado",
      key: "statusLabel",
      render: (tournament) => (
        <Badge variant={statusVariants[tournament.status]}>{tournament.statusLabel}</Badge>
      ),
    },
    { header: "Fechas", key: "dateLabel" },
    { header: "Sede", key: "location" },
    { header: "Partidos", key: "matchesLabel" },
    { header: "Equipos", key: "teamsLabel" },
    {
      header: "Acciones",
      key: "id",
      render: (tournament) => (
        <AdminRowActions
          entityLabel={tournament.name}
          onLocalAction={(action) => {
            const actionLabel = action === "view" ? "Vista" : "Edición";
            const message = action === "view"
              ? `Vista local de ${tournament.name}. No se enviaron datos al servidor.`
              : `Edición local de ${tournament.name}. No se guardaron cambios.`;
            setFeedback(`${actionLabel}: ${message}`);
          }}
          onRemove={() => {
            setRemovedTournamentIds((current) => [...current, tournament.id]);
            setFeedback(`Torneo "${tournament.name}" eliminado solo en esta vista. No se guardaron cambios.`);
          }}
        />
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Link
            className="inline-flex h-12 w-[200px] max-w-full items-center justify-center rounded-lg bg-vt-accent px-4 text-sm font-semibold text-vt-canvas transition-colors hover:bg-vt-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
            to={"/admin/tournaments/create" as string}
          >
            + Nuevo Torneo
          </Link>
        }
        title="Torneos"
        description="Administrá y consultá los torneos registrados."
      />

      {feedback ? (
        <p
          aria-live="polite"
          className="rounded-lg border border-vt-border bg-vt-panel px-4 py-3 text-sm text-vt-muted"
          role="status"
        >
          {feedback}
        </p>
      ) : null}

      <section aria-label="Listado de torneos">
        <DataTable
          columns={columns}
          getRowKey={(tournament) => tournament.id}
          rows={tournaments}
        />
      </section>
    </div>
  );
}
