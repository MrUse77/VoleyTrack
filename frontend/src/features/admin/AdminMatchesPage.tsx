import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "../../components/primitives/Badge";
import { Button } from "../../components/primitives/Button";
import { DataTable, type DataTableColumn } from "../../components/primitives/DataTable";
import { PageHeader } from "../../components/primitives/PageHeader";
import { ADMIN, type AdminMatchFixture } from "../../fixtures";

const statusVariants = {
  finished: "default",
  live: "success",
  today: "accent",
  upcoming: "default",
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

export function AdminMatchesPage() {
  const [removedMatchIds, setRemovedMatchIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const matches = ADMIN.matches.filter((match) => !removedMatchIds.includes(match.id));

  const columns: DataTableColumn<AdminMatchFixture>[] = [
    {
      header: "Estado",
      key: "statusLabel",
      render: (match) => <Badge variant={statusVariants[match.status]}>{match.statusLabel}</Badge>,
    },
    { header: "Fecha y hora", key: "scheduledLabel" },
    { header: "Equipo local", key: "homeTeamName" },
    { header: "Equipo visitante", key: "awayTeamName" },
    { header: "Sede", key: "venue" },
    {
      header: "Acciones",
      key: "id",
      render: (match) => {
        const matchLabel = `${match.homeTeamName} vs ${match.awayTeamName}`;

        return (
          <AdminRowActions
            entityLabel={matchLabel}
            onLocalAction={(action) => {
              const actionLabel = action === "view" ? "Vista" : "Edición";
              const message = action === "view"
                ? `Vista local de ${matchLabel}. No se enviaron datos al servidor.`
                : `Edición local de ${matchLabel}. No se guardaron cambios.`;
              setFeedback(`${actionLabel}: ${message}`);
            }}
            onRemove={() => {
              setRemovedMatchIds((current) => [...current, match.id]);
              setFeedback(`Partido "${matchLabel}" eliminado solo en esta vista. No se guardaron cambios.`);
            }}
          />
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <Link
            className="inline-flex h-12 w-[200px] max-w-full items-center justify-center rounded-lg bg-vt-accent px-4 text-sm font-semibold text-vt-background transition-colors hover:bg-vt-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
            to={"/admin/matches/create" as string}
          >
            + Programar Partido
          </Link>
        }
        title="Partidos"
        description="Administrá y consultá los partidos registrados."
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

      <section aria-label="Listado de partidos">
        <DataTable
          columns={columns}
          getRowKey={(match) => match.id}
          rows={matches}
        />
      </section>
    </div>
  );
}
