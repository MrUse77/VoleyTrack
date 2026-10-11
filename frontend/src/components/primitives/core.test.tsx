import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "./Button";
import { Card } from "./Card";
import {
  Field,
  FormField,
  fieldControlClasses,
  fieldTextareaClasses,
} from "./FormField";
import { IconButton } from "./IconButton";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Chip } from "./Chip";
import { EmptyState } from "./EmptyState";
import { Filter, FilterGroup } from "./FilterGroup";
import { InfoRow } from "./InfoRow";
import { Kpi, KpiGrid } from "./Kpi";
import { LivePill } from "./LivePill";
import { StatePill } from "./StatePill";
import { Toast } from "./Toast";
import { DataTable } from "./DataTable";
import { Modal } from "./Modal";
import { PageHeader } from "./PageHeader";
import { TabBar } from "./TabBar";

const sourceRoot = fileURLToPath(new URL("../../", import.meta.url));
const tokensPath = fileURLToPath(new URL("../../styles/tokens.css", import.meta.url));

function productionTsxFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        return ["generated", "__generated__"].includes(entry.name) ? [] : productionTsxFiles(path);
      }

      if (!entry.name.endsWith(".tsx") || /\.(?:test|spec|gen)\.tsx$/.test(entry.name)) return [];
      return [path];
    })
    .sort();
}

describe("core primitives", () => {
  it("renders token-driven button variants and an accessible icon button", () => {
    const html = renderToStaticMarkup(
      <>
        <Button>Save</Button>
        <Button variant="ghost">Cancel</Button>
        <IconButton aria-label="Close">×</IconButton>
      </>,
    );
    const iconVariant = renderToStaticMarkup(
      <Button variant="icon" aria-label="Add">+</Button>,
    );

    expect(html).toContain("bg-vt-accent");
    expect(html).toContain("border-vt-border");
    expect(html).toContain('aria-label="Close"');
    expect(html).toContain("h-10");
    expect(iconVariant).toContain("w-10");
  });

  it("renders a surface card by default and raises it only when requested", () => {
    const defaultHtml = renderToStaticMarkup(<Card>Card content</Card>);
    const raisedHtml = renderToStaticMarkup(<Card variant="raised">Raised content</Card>);

    expect(defaultHtml).toContain("Card content");
    expect(defaultHtml).toContain("bg-vt-surface");
    expect(defaultHtml).toContain("border-vt-border");
    expect(defaultHtml).not.toContain("bg-vt-raised");
    expect(defaultHtml).not.toContain("border-vt-raised-border");
    expect(defaultHtml).toContain("rounded-2xl");
    expect(raisedHtml).toContain("Raised content");
    expect(raisedHtml).toContain("bg-vt-raised");
    expect(raisedHtml).toContain("border-vt-raised-border");
  });

  it("keeps Card background selection behind the typed variant API", () => {
    const explicitBackgroundCards = productionTsxFiles(sourceRoot).flatMap((file) => {
      const source = readFileSync(file, "utf8");

      return [...source.matchAll(/<Card\b[^>]*>/gs)]
        .filter(([openingTag]) => /\bbg-vt-(?:raised|surface)\b/.test(openingTag))
        .map(([openingTag]) => `${relative(sourceRoot, file)}: ${openingTag.replace(/\s+/g, " ")}`);
    });

    expect(explicitBackgroundCards).toEqual([]);
  });

  it("associates a dark-theme input with its label and helper text", () => {
    const html = renderToStaticMarkup(
      <FormField id="team-name" label="Team name" helperText="Required" placeholder="Enter a name" />,
    );

    expect(html).toContain("<label");
    expect(html).toContain('for="team-name"');
    expect(html).toContain("Team name");
    expect(html).toContain("Required");
    expect(html).toContain("bg-vt-panel");
    expect(html).toContain("border-vt-border");
  });

  it("renders a design field with a label, control styling and an associated error", () => {
    const html = renderToStaticMarkup(
      <Field hint="Requerido" id="team-name" label="Nombre del equipo">
        <input className={fieldControlClasses} placeholder="Ingresá un nombre" />
      </Field>,
    );
    const errorHtml = renderToStaticMarkup(
      <Field error="Nombre inválido" hint="Requerido" id="team-name" label="Nombre del equipo">
        <input className={fieldControlClasses} />
      </Field>,
    );
    const controlHtml = renderToStaticMarkup(
      <>
        <Field full id="notes" label="Notas">
          <textarea className={fieldTextareaClasses} />
        </Field>
        <Field id="position" label="Posición">
          <select className={fieldControlClasses}>
            <option value="punta">Punta</option>
          </select>
        </Field>
      </>,
    );

    expect(html).toContain('for="team-name"');
    expect(html).toContain('id="team-name"');
    expect(html).toContain('aria-describedby="team-name-hint"');
    expect(html).toContain('id="team-name-hint"');
    expect(html).toContain("Requerido");
    expect(html).toContain("h-[46px]");
    expect(html).toContain("rounded-vt-md");
    expect(html).toContain("bg-vt-background");
    expect(html).toContain("text-[13px]");
    expect(html).toContain("placeholder:text-vt-muted-2");
    expect(html).toContain("focus-visible:border-vt-accent");
    expect(html).toContain("focus-visible:shadow-vt-focus-ring");
    expect(html).toContain("disabled:cursor-not-allowed");
    expect(html).toContain("disabled:opacity-[.58]");
    expect(html).not.toContain('aria-invalid="true"');
    expect(errorHtml).toContain('aria-invalid="true"');
    expect(errorHtml).toContain('aria-describedby="team-name-error team-name-hint"');
    expect(errorHtml).toContain('id="team-name-error"');
    expect(errorHtml).toContain("Nombre inválido");
    expect(errorHtml).toContain("text-vt-danger");
    expect(errorHtml).not.toContain('aria-invalid="false"');
    expect(controlHtml).toContain("min-h-[96px]");
    expect(controlHtml).toContain("resize-y");
    expect(controlHtml).toContain("col-span-full");
  });

  it("renders every state pill with its text label and status attribute", () => {
    const html = renderToStaticMarkup(
      <>
        <StatePill status="programado" />
        <StatePill status="envivo" />
        <StatePill status="finalizado" />
      </>,
    );

    expect(html).toContain('data-status="programado"');
    expect(html).toContain("Programado");
    expect(html).toContain('data-status="envivo"');
    expect(html).toContain("En vivo");
    expect(html).toContain('data-status="finalizado"');
    expect(html).toContain("Finalizado");
    expect(html).toContain("font-mono");
    expect(html).toContain("text-[10px]");
    expect(html).toContain("font-extrabold");
    expect(html).toContain("tracking-[0.06em]");
    expect(html).toContain("uppercase");
    expect(html).toContain("bg-vt-background");
    expect(html).toContain("bg-vt-danger");
    expect(html).toContain("bg-vt-success-soft");
    expect(html).toContain("text-vt-success-soft-text");
    expect(html).toContain("border-vt-success-soft-border");
    expect(html).toContain("sr-only");
    expect(html).not.toContain("aria-hidden");
  });

  it("renders labelled filters as pressed buttons inside a labelled group", () => {
    const html = renderToStaticMarkup(
      <FilterGroup aria-label="Filtros de partidos">
        <Filter isActive>En vivo</Filter>
        <Filter>Programado</Filter>
      </FilterGroup>,
    );

    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="Filtros de partidos"');
    expect(html).toContain("<button");
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('aria-pressed="false"');
    expect(html).toContain("h-[36px]");
    expect(html).toContain("px-[14px]");
    expect(html).toContain("rounded-full");
    expect(html).toContain("border-vt-border");
    expect(html).toContain("bg-vt-surface");
    expect(html).toContain("text-vt-muted");
    expect(html).toContain("bg-vt-text");
    expect(html).toContain("text-vt-background");
    expect(html).toContain("gap-[10px]");
    expect(html).toContain("flex-wrap");
    expect(html).toContain("En vivo");
    expect(html).toContain("Programado");
  });

  it("renders chip variants from the shared chip spec", () => {
    const html = renderToStaticMarkup(
      <>
        <Chip>Liga A1</Chip>
        <Chip variant="accent">En vivo</Chip>
      </>,
    );

    expect(html).toContain("Liga A1");
    expect(html).toContain("text-[11px]");
    expect(html).toContain("font-bold");
    expect(html).toContain("tracking-[0.04em]");
    expect(html).toContain("px-[10px]");
    expect(html).toContain("py-[6px]");
    expect(html).toContain("rounded-full");
    expect(html).toContain("border-vt-border");
    expect(html).toContain("bg-vt-background");
    expect(html).toContain("text-vt-muted");
    expect(html).toContain("bg-vt-accent");
    expect(html).toContain("text-vt-background");
  });

  it("announces the live pill as a status region with a reduced-motion safe dot", () => {
    const html = renderToStaticMarkup(<LivePill />);

    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain("En vivo");
    expect(html).toContain("font-mono");
    expect(html).toContain("text-[10px]");
    expect(html).toContain("font-extrabold");
    expect(html).toContain("tracking-[0.06em]");
    expect(html).toContain("gap-[6px]");
    expect(html).toContain("px-[8px]");
    expect(html).toContain("py-[4px]");
    expect(html).toContain("bg-vt-danger");
    expect(html).toContain("text-vt-on-danger");
    expect(html).toContain("h-[6px]");
    expect(html).toContain("w-[6px]");
    expect(html).toContain("animate-vt-pulse");
    expect(html).toContain("motion-reduce:animate-none");
    expect(html).toContain('aria-hidden="true"');
  });

  it("announces the toast politely, unmounts it when closed, and offers keyboard dismissal on demand", () => {
    const html = renderToStaticMarkup(<Toast>Equipo creado</Toast>);
    const closedHtml = renderToStaticMarkup(<Toast open={false}>Equipo creado</Toast>);
    const dismissibleHtml = renderToStaticMarkup(
      <Toast onDismiss={() => undefined}>Equipo creado</Toast>,
    );

    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain('aria-atomic="true"');
    expect(html).toContain("Equipo creado");
    expect(html).toContain("fixed");
    expect(html).toContain("right-[18px]");
    expect(html).toContain("bottom-[18px]");
    expect(html).toContain("z-50");
    expect(html).toContain("bg-vt-text");
    expect(html).toContain("text-vt-background");
    expect(html).toContain("px-[14px]");
    expect(html).toContain("py-[12px]");
    expect(html).toContain("rounded-[12px]");
    expect(html).toContain("text-[13px]");
    expect(html).toContain("font-bold");
    expect(html).toContain("shadow-vt-toast");
    expect(html).toContain("animate-vt-toast-in");
    expect(html).toContain("motion-reduce:animate-none");
    expect(html).not.toContain("<button");
    expect(closedHtml).toBe("");
    expect(dismissibleHtml).toContain("<button");
    expect(dismissibleHtml).toContain('type="button"');
    expect(dismissibleHtml).toContain('aria-label="Cerrar notificación"');
  });

  it("renders the kpi grid and the design kpi typography", () => {
    const html = renderToStaticMarkup(
      <KpiGrid>
        <Kpi label="Partidos" sub={<><b>+2</b> esta semana</>} value="128" />
      </KpiGrid>,
    );

    expect(html).toContain('role="list"');
    expect(html).toContain('role="listitem"');
    expect(html).toContain("grid-cols-1");
    expect(html).toContain("min-[600px]:grid-cols-2");
    expect(html).toContain("min-[1200px]:grid-cols-4");
    expect(html).toContain("gap-[16px]");
    expect(html).toContain("p-[18px]");
    expect(html).toContain("rounded-vt");
    // renderToStaticMarkup escapes the arbitrary-variant selector, so the markup
    // carries `[&amp;&gt;b]:text-vt-success` for the class `[&>b]:text-vt-success`.
    expect(html).toContain("[&amp;&gt;b]:text-vt-success");
    expect(html).toContain("bg-vt-surface");
    expect(html).toContain("border-vt-border");
    expect(html).toContain("font-mono");
    expect(html).toContain("text-[10px]");
    expect(html).toContain("font-extrabold");
    expect(html).toContain("uppercase");
    expect(html).toContain("tracking-[0.08em]");
    expect(html).toContain("text-[32px]");
    expect(html).toContain("font-black");
    expect(html).toContain("leading-none");
    expect(html).toContain("tracking-[-0.02em]");
    expect(html).toContain("tabular-nums");
    expect(html).toContain("Partidos");
    expect(html).toContain("128");
  });

  it("renders a centred empty state announced as a status", () => {
    const html = renderToStaticMarkup(
      <EmptyState description="Cambiá los filtros o creá un nuevo partido." title="No hay partidos" />,
    );

    expect(html).toContain('role="status"');
    expect(html).toContain("px-[20px]");
    expect(html).toContain("py-[36px]");
    expect(html).toContain("text-center");
    expect(html).toContain("<h2");
    expect(html).toContain("text-[18px]");
    expect(html).toContain("No hay partidos");
    expect(html).toContain("text-[13px]");
    expect(html).toContain("text-vt-muted");
    expect(html).toContain("Cambiá los filtros o creá un nuevo partido.");
  });

  it("renders an info row with a muted label, a bold value and no trailing border", () => {
    const html = renderToStaticMarkup(<InfoRow label="Duración" value="1h 42m" />);

    expect(html).toContain("Duración");
    expect(html).toContain("1h 42m");
    expect(html).toContain("flex");
    expect(html).toContain("justify-between");
    expect(html).toContain("gap-[12px]");
    expect(html).toContain("border-b");
    expect(html).toContain("border-vt-border-2");
    expect(html).toContain("py-[10px]");
    expect(html).toContain("text-[13px]");
    expect(html).toContain("last:border-b-0");
    expect(html).toContain("text-vt-muted");
    expect(html).toContain("font-bold");
  });

  it("renders an avatar as a named image or as decorative initials", () => {
    const named = renderToStaticMarkup(<Avatar initials="MF" name="Martín Fernández" />);
    const decorative = renderToStaticMarkup(<Avatar initials="A" />);

    expect(named).toContain('role="img"');
    expect(named).toContain('aria-label="Martín Fernández"');
    expect(named).toContain("MF");
    expect(named).toContain("bg-gradient-to-br");
    expect(named).toContain("from-vt-accent");
    expect(named).toContain("to-vt-accent-strong");
    expect(named).toContain("h-[36px]");
    expect(named).toContain("w-[36px]");
    expect(named).toContain("rounded-full");
    expect(named).toContain("text-[13px]");
    expect(named).toContain("font-extrabold");
    expect(named).toContain("text-vt-background");
    expect(named).not.toContain("aria-hidden");
    expect(decorative).toContain('aria-hidden="true"');
    expect(decorative).not.toContain('role="img"');
  });

  it("tokensises the design values that the design hardcodes outside its :root", () => {
    const tokens = readFileSync(tokensPath, "utf8");

    expect(tokens).toContain("--color-vt-success-soft: #0f2a1a");
    expect(tokens).toContain("--color-vt-success-soft-text: #86efac");
    expect(tokens).toContain("--color-vt-success-soft-border: #14532d");
    expect(tokens).toContain("--color-vt-warn-soft: #2a1e0a");
    expect(tokens).toContain("--color-vt-warn-soft-text: #fde68a");
    expect(tokens).toContain("--color-vt-warn-soft-border: #7c4d0a");
    expect(tokens).toContain("--color-vt-accent-strong: #ff6a3d");
    expect(tokens).toContain("--color-vt-on-danger: #ffffff");
    expect(tokens).toContain("--radius-vt-md: 12px");
    expect(tokens).toContain(
      "--shadow-vt-focus-ring: 0 0 0 3px color-mix(in oklch, var(--color-vt-accent) 22%, transparent)",
    );
    expect(tokens).toContain("--shadow-vt-toast: 0 12px 32px rgba(0,0,0,.4)");
    expect(tokens).toContain("--animate-vt-pulse: vt-pulse 1.2s ease-in-out infinite");
    expect(tokens).toContain("--animate-vt-toast-in: vt-toast-in 250ms ease-out");

    // The design hardcodes these; no production TSX may re-inline them now that
    // they are tokens. A guard that matches zero files is a broken guard, so the
    // walk is asserted to be non-empty first.
    const files = productionTsxFiles(sourceRoot);

    expect(files.length).toBeGreaterThan(0);

    const offenders: string[] = [];

    for (const file of files) {
      const source = readFileSync(file, "utf8");

      for (const literal of ["#0f2a1a", "#86efac", "#14532d", "#2a1e0a", "#fde68a", "#7c4d0a", "#ff6a3d"]) {
        if (source.includes(literal)) {
          offenders.push(`${relative(sourceRoot, file)}: ${literal}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it("defines semantic tokens for raised primitive surfaces", () => {
    const tokens = readFileSync(tokensPath, "utf8");

    expect(tokens).toContain("--color-vt-raised: #1e293b");
    expect(tokens).toContain("--color-vt-raised-border: #334155");
  });

  it("renders controlled tabs with an active value and change callback", () => {
    const html = renderToStaticMarkup(
      <TabBar
        aria-label="Match status"
        onChange={() => undefined}
        tabs={[{ label: "Live", value: "live" }, { label: "Finished", value: "finished" }]}
        value="live"
      />,
    );

    expect(html).toContain('role="tablist"');
    expect(html).toContain('aria-selected="true"');
    expect(html).toContain("bg-vt-accent");
    expect(html).toContain("Finished");
  });

  it("renders a modal backdrop, close control, and content slot", () => {
    const html = renderToStaticMarkup(
      <Modal isOpen onClose={() => undefined} title="Player details">
        Modal content
      </Modal>,
    );

    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('aria-label="Close modal"');
    expect(html).toContain("bg-black/60");
    expect(html).toContain("Modal content");
  });

  it("renders table headers, rows, and an optional sort indicator", () => {
    const html = renderToStaticMarkup(
      <DataTable
        columns={[
          { header: "Team", key: "team" },
          { header: "Points", key: "points", sortIndicator: "descending" },
        ]}
        getRowKey={(row) => row.team}
        rows={[{ points: 9, team: "Tigres" }]}
      />,
    );

    expect(html).toContain("<th");
    expect(html).toContain("Tigres");
    expect(html).toContain("Points ↓");
    expect(html).toContain("border-vt-border");
  });

  it("renders semantic badges and the default page header hierarchy", () => {
    const html = renderToStaticMarkup(
      <>
        <Badge variant="success">Live</Badge>
        <Badge variant="ok">Activo</Badge>
        <Badge variant="warn">Pendiente</Badge>
        <PageHeader actions={<Button>Add match</Button>} description="Season overview" title="Matches" />
      </>,
    );

    expect(html).toContain("text-[10px]");
    expect(html).toContain("font-bold");
    expect(html).toContain("uppercase");
    expect(html).toContain("tracking-[0.2em]");
    expect(html).toContain("rounded-full");
    expect(html).toContain("border");
    expect(html).toContain("border-vt-success/30");
    expect(html).toContain("bg-vt-success/10");
    expect(html).toContain("Activo");
    expect(html).toContain("bg-vt-success-soft");
    expect(html).toContain("text-vt-success-soft-text");
    expect(html).toContain("border-vt-success-soft-border");
    expect(html).toContain("Pendiente");
    expect(html).toContain("bg-vt-warn-soft");
    expect(html).toContain("text-vt-warn-soft-text");
    expect(html).toContain("border-vt-warn-soft-border");
    expect(html).not.toContain("bg-white");
    expect(html).not.toContain("bg-black");
    expect(html).toContain("Matches");
    expect(html).toMatch(/<h1 class="[^"]*text-\[32px\][^"]*font-black[^"]*">Matches<\/h1>/);
    expect(html).toContain("Season overview");
    expect(html).toContain("text-sm");
    expect(html).toContain("leading-6");
    expect(html).toContain("Add match");
    expect(html).toMatch(/<header class="[^"]*flex-col[^"]*items-stretch[^"]*sm:flex-row[^"]*sm:items-start[^"]*sm:justify-between/);
    expect(html).toMatch(/<div class="[^"]*w-full[^"]*min-w-0[^"]*flex-wrap[^"]*sm:w-auto[^"]*sm:justify-end">.*Add match/);
  });

  it("renders the compact page header with dashboard typography", () => {
    const html = renderToStaticMarkup(
      <PageHeader
        description="Live matches and tournament summaries."
        title="Public dashboard"
        variant="compact"
      />,
    );

    expect(html).toMatch(/<h1 class="[^"]*text-\[26px\][^"]*font-bold[^"]*">Public dashboard<\/h1>/);
    expect(html).toMatch(/<p class="[^"]*text-\[13px\][^"]*">Live matches and tournament summaries.<\/p>/);
    expect(html).not.toContain('variant="compact"');
  });
});
