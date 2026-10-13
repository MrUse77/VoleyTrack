import { useLocation, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "../../components/primitives/Button";
import { buttonClasses } from "../../components/primitives/buttonClasses";
import { DataTable, type DataTableColumn } from "../../components/primitives/DataTable";
import { Field, fieldControlClasses } from "../../components/primitives/Field";
import { Modal } from "../../components/primitives/Modal";
import { PageHeader } from "../../components/primitives/PageHeader";
import { ADMIN, type AdminStaffFixture } from "../../fixtures";

/**
 * Design: frontend/design/html/voleytrack-admin-gestion.html — one screen holds the staff
 * `.table-wrap` (Staff | Rol | Email | Torneo | action) and the create/edit dialog
 * (`newStaff()` and `editStaff(...)` both open `#staff-overlay`, the same modal), plus the
 * `.page-head` action "+ Nuevo integrante". The app's route was register-only, so the screen
 * is now the design's: table first, one modal for both create and edit.
 *
 * The design's row action is spelled with prototype inline styles
 * (`style="height:30px;font-size:11px"`); its intent - a control smaller than the 40px
 * `.btn` - is the modelled `sm` button size (32px/12px) rather than a raw 30px one-off.
 *
 * The design gives each staff row a `Torneo` and the modal a "Torneo asignado" select whose
 * options are its prototype competitions plus `Todos`; the app derives the options from the
 * real tournament fixture and keeps the design's `Todos` choice.
 */
type StaffRole = "scorer" | "referee";

type StaffRecord = AdminStaffFixture;

type StaffForm = {
  email: string;
  fullName: string;
  role: StaffRole;
  tournamentLabel: string;
};

type StaffErrors = Partial<Record<keyof StaffForm, string>>;

const roleOptions: readonly { label: string; value: StaffRole }[] = [
  { label: "Planillero", value: "scorer" },
  { label: "Árbitro", value: "referee" },
];

/** The design's "Todos" choice (`<option>Todos</option>`) after the real tournaments. */
const allTournamentsLabel = "Todos";

const fieldIds = {
  email: "staff-email",
  fullName: "staff-full-name",
  role: "staff-role",
  tournamentLabel: "staff-tournament",
} as const;

const initialForm: StaffForm = {
  email: "",
  fullName: "",
  role: "scorer",
  tournamentLabel: ADMIN.tournaments[0]?.name ?? allTournamentsLabel,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateStaffForm(form: StaffForm): StaffErrors {
  const errors: StaffErrors = {};

  if (!form.fullName.trim()) {
    errors.fullName = "Ingresá el nombre completo.";
  }

  if (!form.email.trim()) {
    errors.email = "Ingresá el email.";
  } else if (!emailPattern.test(form.email.trim())) {
    errors.email = "Ingresá un email válido.";
  }

  return errors;
}

function roleLabel(role: string): string {
  return roleOptions.find((option) => option.value === role)?.label ?? role;
}

function staffFormOf(member: StaffRecord): StaffForm {
  const role = roleOptions.some((option) => option.value === member.role)
    ? (member.role as StaffRole)
    : "scorer";

  return {
    email: member.email,
    fullName: member.fullName,
    role,
    tournamentLabel: member.tournamentLabel,
  };
}

/**
 * `Field` renders an optional hint and an optional error as two separate slots, so the old
 * single-message field has to choose one: passing both would put two ids in
 * `aria-describedby`. The error keeps its `role="alert"` wrapper, and `Field` derives
 * `aria-invalid` from `error` being present.
 */
function feedbackProps(error: string | undefined, hint: string): { error?: ReactNode; hint?: ReactNode } {
  return error ? { error: <span role="alert">{error}</span> } : { hint };
}

type StaffFormModalProps = {
  member: StaffRecord | null;
  onClose: () => void;
  onSave: (form: StaffForm) => void;
  tournamentOptions: readonly string[];
};

/**
 * The design's `#staff-overlay`. It is mounted only while the route's search asks for it
 * (`?nuevo=1` or `?editar=<id>`), so its fields start from the record being edited and reset
 * for the next open instead of carrying the previous draft over.
 */
function StaffFormModal({ member, onClose, onSave, tournamentOptions }: StaffFormModalProps) {
  const [form, setForm] = useState<StaffForm>(member ? staffFormOf(member) : initialForm);
  const [errors, setErrors] = useState<StaffErrors>({});

  const updateField = <Field extends keyof StaffForm>(field: Field, value: StaffForm[Field]) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;

      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateStaffForm(form);
    setErrors(nextErrors);

    const firstInvalidField = (Object.keys(nextErrors) as Array<keyof StaffForm>)[0];
    if (firstInvalidField) {
      event.currentTarget.querySelector<HTMLElement>(`#${fieldIds[firstInvalidField]}`)?.focus();
      return;
    }

    onSave(form);
  };

  return (
    <Modal
      closeLabel="Cerrar"
      description={member ? member.email : "Alta de un miembro del staff"}
      footer={
        <>
          <Button onClick={onClose} type="button" variant="ghost">
            Cancelar
          </Button>
          <Button form="staff-form" type="submit">
            {member ? "Guardar cambios" : "Guardar integrante"}
          </Button>
        </>
      }
      isOpen
      onClose={onClose}
      title={member ? "Editar integrante" : "Nuevo integrante"}
    >
      {/* Design: voleytrack-admin.css:175-178 `.form-grid` (two columns, 18px gap, `.full`
          spanning both) with a `.field` per control. */}
      <form className="grid gap-[18px] min-[901px]:grid-cols-2" id="staff-form" noValidate onSubmit={handleSubmit}>
        <Field
          className="col-span-full"
          id={fieldIds.fullName}
          label="Nombre completo"
          {...feedbackProps(errors.fullName, "Nombre y apellido de la persona.")}
        >
          <input
            autoComplete="name"
            className={fieldControlClasses}
            name="fullName"
            onChange={(event) => updateField("fullName", event.target.value)}
            placeholder="Ej: Ana Peralta"
            required
            value={form.fullName}
          />
        </Field>
        <Field
          id={fieldIds.email}
          label="Email"
          {...feedbackProps(errors.email, "correo@ejemplo.com")}
        >
          <input
            autoComplete="email"
            className={fieldControlClasses}
            name="email"
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="ana@voleytrack.com"
            required
            type="email"
            value={form.email}
          />
        </Field>
        <Field id={fieldIds.role} label="Rol">
          <select
            className={fieldControlClasses}
            name="role"
            onChange={(event) => updateField("role", event.target.value as StaffRole)}
            value={form.role}
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </Field>
        <Field className="col-span-full" id={fieldIds.tournamentLabel} label="Torneo asignado">
          <select
            className={fieldControlClasses}
            name="tournamentLabel"
            onChange={(event) => updateField("tournamentLabel", event.target.value)}
            value={form.tournamentLabel}
          >
            {tournamentOptions.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </Field>
      </form>
    </Modal>
  );
}

export function AdminStaffPage() {
  const [staff, setStaff] = useState<readonly StaffRecord[]>([...ADMIN.staff]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { search } = useLocation() as { search: Record<string, unknown> };
  const navigate = useNavigate();

  const editingId = typeof search.editar === "string" ? search.editar : null;
  const editing = editingId ? staff.find((member) => member.id === editingId) ?? null : null;
  const isOpen = editing !== null || search.nuevo === true;

  const tournamentOptions = [
    ...ADMIN.tournaments.map((tournament) => tournament.name),
    allTournamentsLabel,
  ];

  const closeModal = () => {
    navigate({ to: "/admin/staff/register", search: {} });
  };

  const openEdit = (member: StaffRecord) => {
    navigate({ to: "/admin/staff/register", search: { editar: member.id } });
  };

  const save = (form: StaffForm) => {
    const fullName = form.fullName.trim();

    if (editing) {
      setStaff((current) =>
        current.map((member) =>
          member.id === editing.id
            ? { ...member, ...form, fullName, roleLabel: roleLabel(form.role) }
            : member,
        ),
      );
      setFeedback(`Integrante "${fullName}" actualizado solo en esta vista. No se enviaron datos al servidor.`);
    } else {
      setStaff((current) => [
        ...current,
        {
          email: form.email.trim(),
          fullName,
          id: `staff-local-${current.length + 1}`,
          role: form.role,
          roleLabel: roleLabel(form.role),
          status: "active",
          statusLabel: "Activo",
          tournamentLabel: form.tournamentLabel,
        },
      ]);
      setFeedback(`Integrante "${fullName}" agregado solo en esta vista. No se enviaron datos al servidor.`);
    }

    closeModal();
  };

  const columns: DataTableColumn<StaffRecord>[] = [
    {
      header: "Staff",
      key: "fullName",
      render: (member) => <b className="font-bold text-vt-text">{member.fullName}</b>,
    },
    { header: "Rol", key: "roleLabel" },
    { header: "Email", key: "email" },
    { header: "Torneo", key: "tournamentLabel" },
    {
      header: "Acciones",
      key: "id",
      render: (member) => (
        <button
          aria-label={`Editar ${member.fullName}`}
          className={buttonClasses("surface", "sm")}
          onClick={() => openEdit(member)}
          type="button"
        >
          Editar
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        actions={
          <button
            className={buttonClasses("primary")}
            onClick={() => navigate({ to: "/admin/staff/register", search: { nuevo: true } })}
            type="button"
          >
            + Nuevo integrante
          </button>
        }
        description="Gestión del staff: planilleros y árbitros."
        title="Staff & gestión"
      />

      {feedback ? (
        <p
          aria-live="polite"
          className="rounded-xl border border-vt-border bg-vt-background px-[14px] py-3 text-[13px] font-bold text-vt-text"
          role="status"
        >
          {feedback}
        </p>
      ) : null}

      <section aria-label="Listado de staff">
        <DataTable columns={columns} getRowKey={(member) => member.id} rows={[...staff]} />
      </section>

      {isOpen ? (
        <StaffFormModal
          key={editing?.id ?? "nuevo"}
          member={editing}
          onClose={closeModal}
          onSave={save}
          tournamentOptions={tournamentOptions}
        />
      ) : null}
    </div>
  );
}
