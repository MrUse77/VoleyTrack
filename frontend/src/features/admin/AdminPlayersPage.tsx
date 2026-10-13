import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Badge } from "../../components/primitives/Badge";
import { Button } from "../../components/primitives/Button";
import { DataTable, type DataTableColumn } from "../../components/primitives/DataTable";
import { PageHeader } from "../../components/primitives/PageHeader";
import { ADMIN, type AdminPlayerFixture } from "../../fixtures";

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

export function AdminPlayersPage() {
  const [removedPlayerIds, setRemovedPlayerIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const players = ADMIN.players.filter((player) => !removedPlayerIds.includes(player.id));

  const columns: DataTableColumn<AdminPlayerFixture>[] = [
    { header: "Jugador", key: "fullName" },
    { header: "Equipo", key: "teamName" },
    { header: "Dorsal", key: "number" },
    { header: "Posición", key: "position" },
    {
      header: "Estado",
      key: "statusLabel",
      render: (player) => <Badge variant="success">{player.statusLabel}</Badge>,
    },
    {
      header: "Acciones",
      key: "id",
      render: (player) => (
        <AdminRowActions
          entityLabel={player.fullName}
          onLocalAction={(action) => {
            const actionLabel = action === "view" ? "Vista" : "Edición";
            const message = action === "view"
              ? `Vista local de ${player.fullName}. No se enviaron datos al servidor.`
              : `Edición local de ${player.fullName}. No se guardaron cambios.`;
            setFeedback(`${actionLabel}: ${message}`);
          }}
          onRemove={() => {
            setRemovedPlayerIds((current) => [...current, player.id]);
            setFeedback(`Jugador "${player.fullName}" eliminado solo en esta vista. No se guardaron cambios.`);
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
            className="inline-flex h-12 w-[200px] max-w-full items-center justify-center rounded-lg bg-vt-accent px-4 text-sm font-semibold text-vt-background transition-colors hover:bg-vt-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
            to={"/admin/players/create" as string}
          >
            + Nuevo Jugador
          </Link>
        }
        title="Jugadores"
        description="Administrá y consultá los jugadores registrados."
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

      <section aria-label="Listado de jugadores">
        <DataTable
          columns={columns}
          getRowKey={(player) => player.id}
          rows={players}
        />
      </section>
    </div>
  );
}
