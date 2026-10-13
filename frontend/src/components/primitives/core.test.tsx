import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "./Button";
import { buttonClasses } from "./buttonClasses";
import { Card, CardBody, CardHeader } from "./Card";
import {
  Field,
  fieldControlClasses,
  fieldTextareaClasses,
} from "./Field";
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
import { Num, numClasses } from "./Num";
import { Modal } from "./Modal";
import { PageHeader } from "./PageHeader";
import { TabBar } from "./TabBar";

const sourceRoot = fileURLToPath(new URL("../../", import.meta.url));
const tokensPath = fileURLToPath(new URL("../../styles/tokens.css", import.meta.url));

/**
 * Removes `//` and block comments while leaving string literals intact.
 *
 * `cardOpeningTags` must not classify documentation as a call site: a doc comment that
 * happens to mention `<Card>` would otherwise inflate the legacy count (and silently
 * break the ratchet in the safe direction).
 */
function stripComments(source: string): string {
  let stripped = "";
  let index = 0;
  let quote: string | null = null;

  while (index < source.length) {
    const char = source[index];
    const next = source[index + 1];

    if (quote) {
      stripped += char;

      if (char === "\\") {
        stripped += next ?? "";
        index += 2;
        continue;
      }

      if (char === quote) quote = null;
      index += 1;
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      stripped += char;
      index += 1;
      continue;
    }

    if (char === "/" && next === "/") {
      const newline = source.indexOf("\n", index);
      index = newline === -1 ? source.length : newline;
      continue;
    }

    if (char === "/" && next === "*") {
      const close = source.indexOf("*/", index + 2);
      index = close === -1 ? source.length : close + 2;
      continue;
    }

    stripped += char;
    index += 1;
  }

  return stripped;
}

/**
 * Returns the opening tag of every `<Card` JSX element in `source`.
 *
 * The tag is terminated by the first `>` at brace depth 0 and outside a string, so
 * `onClick={() => …}` and `title="a > b"` cannot truncate or split a tag. A plain
 * `/<Card\b[^>]*>/` regex would end the tag at the `>` of an arrow function and then
 * misclassify the props that follow it.
 */
function cardOpeningTags(source: string): string[] {
  const tags: string[] = [];
  let cursor = source.indexOf("<Card");
  while (cursor !== -1) {
    const boundary = source[cursor + 5];

    // `<CardHeader` / `<CardBody` also start with `<Card`; only a delimiter or the end
    // of the tag starts a real Card element.
    if (boundary !== undefined && !/[\s/>]/.test(boundary)) {
      cursor = source.indexOf("<Card", cursor + 5);
      continue;
    }

    let depth = 0;
    let quote: string | null = null;
    let end = -1;

    for (let index = cursor + 5; index < source.length; index += 1) {
      const char = source[index];

      if (quote) {
        if (char === "\\") index += 1;
        else if (char === quote) quote = null;
        continue;
      }

      if (char === '"' || char === "'" || char === "`") {
        quote = char;
      } else if (char === "{") {
        depth += 1;
      } else if (char === "}") {
        depth -= 1;
      } else if (char === ">" && depth === 0) {
        end = index;
        break;
      }
    }

    if (end === -1) break;

    tags.push(source.slice(cursor, end + 1));
    cursor = source.indexOf("<Card", end + 1);
  }

  return tags;
}

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
  it("renders the design's pill button treatments and an accessible icon button", () => {
    const html = renderToStaticMarkup(
      <>
        <Button>Save</Button>
        <Button variant="surface">Neutral</Button>
        <Button variant="ghost">Cancel</Button>
        <IconButton aria-label="Close">×</IconButton>
      </>,
    );
    const iconVariant = renderToStaticMarkup(
      <Button variant="icon" aria-label="Add">+</Button>,
    );

    // Design source: frontend/design/html/voleytrack.css:69-74
    //   .btn{height:40px;padding:0 16px;border-radius:999px;border:1px solid var(--border);
    //        background:var(--surface);color:var(--fg);font-size:13px;font-weight:700;
    //        display:inline-flex;align-items:center;gap:8px;white-space:nowrap}
    //   .btn:hover{border-color:#2d3d5f}
    //   .btn.accent{background:var(--accent);border-color:var(--accent);color:#0b1220}
    //   .btn.accent:hover{filter:brightness(1.06)}
    //   .btn.ghost{background:transparent}
    expect(html).toContain("rounded-full");
    expect(html).toContain("h-10");
    expect(html).toContain("text-[13px]");
    expect(html).toContain("font-bold");
    expect(html).toContain("whitespace-nowrap");
    expect(html).toContain("gap-2");
    expect(html).toContain("px-4");
    // .btn.accent: accent fill, dark ink, hover is a brightness filter, not a second hex.
    expect(html).toContain("bg-vt-accent");
    expect(html).toContain("border-vt-accent");
    expect(html).toContain("text-vt-background");
    expect(html).toContain("hover:brightness-[1.06]");
    // .btn: the design's default is a --surface fill.
    expect(html).toContain("bg-vt-surface");
    expect(html).toContain("text-vt-text");
    // .btn:hover border colour, tokenised so no raw hex reaches the component.
    expect(html).toContain("border-vt-border");
    expect(html).toContain("border-vt-border-hover");
    expect(html).toContain("bg-transparent");
    expect(html).toContain('aria-label="Close"');
    expect(iconVariant).toContain("w-10");
  });

  it("keeps the design's pill treatment reusable for link-shaped buttons", () => {
    // Design source: frontend/design/html/voleytrack-dashboard.html:63 and :71 render
    // `<a class="btn accent">` and `<a class="btn" style="height:32px;font-size:12px">`,
    // i.e. the design puts `.btn` on anchors wherever the control navigates. A `<button>`
    // cannot carry an href, so the treatment is exported once for those anchors instead of
    // being copied into each screen that needs one.
    const primaryButton = renderToStaticMarkup(<Button>Ver partido en vivo</Button>);
    const smallGhostLink = buttonClasses("ghost", "sm", "w-full justify-center border-dashed");

    // The rendered button keeps the design's default `.btn` geometry (40px, 13px).
    expect(primaryButton).toContain("h-10");
    expect(primaryButton).toContain("text-[13px]");

    // The one design form that is not 40px: the dashboard's 32px/12px "Ver todos".
    expect(smallGhostLink).toContain("h-8");
    expect(smallGhostLink).toContain("text-[12px]");
    expect(smallGhostLink).toContain("bg-transparent");
    expect(smallGhostLink).toContain("border-dashed");
    expect(smallGhostLink).toContain("w-full");

    // Sizes are exclusive: appending h-8/text-[12px] to a base that also declared
    // h-10/text-[13px] would lose to the later utility in Tailwind's output, which is why
    // the size is a parameter and not a caller-supplied override.
    expect(smallGhostLink).not.toContain("h-10");
    expect(smallGhostLink).not.toContain("text-[13px]");
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

    // The default stays the transitional uniform `p-6` box so none of the 66 existing
    // call sites move; the design's clipping box is opt-in via `padded={false}`.
    expect(defaultHtml).toContain("p-6");
    expect(defaultHtml).not.toContain("overflow-hidden");
    expect(raisedHtml).toContain("p-6");
  });

  it("expresses the design's structural card through CardHeader and CardBody", () => {
    const html = renderToStaticMarkup(
      <Card padded={false}>
        <CardHeader>
          Plantel
          <small>18 jugadores</small>
        </CardHeader>
        <CardBody>Contenido</CardBody>
      </Card>,
    );

    // Design source: frontend/design/html/voleytrack.css:75-78
    //   .card{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden}
    //   .card-h{padding:18px 20px 0;font-weight:800;font-size:14px;letter-spacing:-0.01em;
    //           display:flex;align-items:center;justify-content:space-between;gap:12px}
    //   .card-h small{font-family:var(--font-mono);font-size:11px;letter-spacing:.06em;
    //                 text-transform:uppercase;color:var(--muted);font-weight:700}
    //   .card-b{padding:18px 20px}
    expect(html).toContain("overflow-hidden");
    expect(html).not.toContain("p-6");
    expect(html).toContain("rounded-2xl");
    expect(html).toContain("border-vt-border");
    expect(html).toContain("bg-vt-surface");
    expect(html).toContain("flex");
    expect(html).toContain("items-center");
    expect(html).toContain("justify-between");
    expect(html).toContain("gap-3");
    expect(html).toContain("px-5");
    expect(html).toContain("pt-[18px]");
    expect(html).toContain("py-[18px]");
    expect(html).toContain("text-[14px]");
    expect(html).toContain("font-extrabold");
    expect(html).toContain("tracking-[-0.01em]");
    // renderToStaticMarkup escapes the `&` of an arbitrary variant selector.
    expect(html).toContain("[&amp;_small]:font-mono");
    expect(html).toContain("[&amp;_small]:text-[11px]");
    expect(html).toContain("[&amp;_small]:font-bold");
    expect(html).toContain("[&amp;_small]:tracking-[0.06em]");
    expect(html).toContain("[&amp;_small]:uppercase");
    expect(html).toContain("[&amp;_small]:text-vt-muted");
    expect(html).toContain("Plantel");
    expect(html).toContain("18 jugadores");
    expect(html).toContain("Contenido");
  });

  it("ratchets the legacy uniform-padding Card form so it cannot grow", () => {
    const productionFiles = productionTsxFiles(sourceRoot);

    // A guard that walks an empty tree is a broken guard, not a passing one.
    expect(productionFiles.length).toBeGreaterThan(0);

    // Classification reads the opening tag, so every `<Card` in the tree must resolve
    // to the single `Card` export: an aliased import would hide call sites from the
    // walk. No alias exists today.
    const aliasedImports = productionFiles.flatMap((file) => {
      const source = readFileSync(file, "utf8");

      return [...source.matchAll(/import\s*\{([^}]*)\}\s*from\s*"([^"]*\/Card)"/g)]
        .filter(([, bindings]) => /\bas\b/.test(bindings))
        .map(([statement]) => `${relative(sourceRoot, file)}: ${statement.replace(/\s+/g, " ")}`);
    });

    expect(aliasedImports).toEqual([]);

    const cards = productionFiles.flatMap((file) =>
      cardOpeningTags(stripComments(readFileSync(file, "utf8"))).map((tag) => ({ file, tag })),
    );

    expect(cards.length).toBeGreaterThan(0);

    // Anti-under-count: a walk or comment stripper that silently dropped call sites would
    // let the ceiling below pass while the tree moved underneath it. The dashboard slice
    // (T11) deliberately deleted four uniform-padding call sites and added three structural
    // ones, so the measured total moved from 71 to 70 and the floor moves with it. The
    // matches and tournaments slices (T12/T13) rebuilt both public list screens, their
    // detail routes and the bracket widget onto the structural form, which took the measured
    // total to 55 across 19 production files. The teams and players slices (T14/T15) added
    // the two new list screens and the design's `Rendimiento ÚLTIMOS 5` card, all structural,
    // and converted the player detail's stat-breakdown and recent-matches cards onto the
    // structural form, which took the measured total to 59 across 21 production files, so the
    // floor moves to those values. T16 then aligned the public live screen, converting its
    // three legacy uniform-padding Cards (unknown-match, scheduled-match and metadata) to the
    // structural form and adding the design's own structural set (set history, court, event
    // timeline, team statistics, top scorers, the two roster panels and the shared metadata
    // panel), which took the measured total to 66 across 23 production files, so the floor
    // moves to those values. T17 then aligned the three admin screens (the staff table + its
    // dialog, the players and matches lists, and the three create forms): every card it added
    // is structural and the three form boxes that carried the app-only raised fill became
    // structural, so the measured total moved to 72 across 27 production files and the floor
    // moves with it. T18 then aligned the admin tournament screens: the shared
    // `TournamentFormCard` replaced the create form's own uniform box, the six admin
    // tournament routes render through the shared tournament frame, and the three content tabs
    // lost their own uniform-padding header and panel cards (the same content is now the
    // frame's card and each panel's table), so the measured total moved to 70 across 28
    // production files and the floors move to those values. T25 then aligned the planillero, which
    // replaced the control-room screen's four uniform-padding Cards with two structural ones (the
    // empty state's card and the setup card), so the measured total moved 81 → 79 across the same 35
    // production files and the total floor moves with it, while the legacy form stays at its measured
    // 24/8 and neither legacy ceiling moves.
    // The polish slice that built the public filter panel added the shared `FilterPanel`
    // primitive (one structural `Card` in a new file) and converted the scoring screen's
    // fallback to the structural form, so the measured total moved 79 -> 80 across 35 -> 36
    // production files and both floors move with it.
    expect(cards.length).toBeGreaterThanOrEqual(80);
    expect(new Set(cards.map(({ file }) => file)).size).toBeGreaterThanOrEqual(36);

    // A JSX spread could inject `padded={false}` (or a shadowing prop) behind the
    // guard's back and the count would silently drift. Fail loudly instead of
    // guessing. No spread exists today.
    const spreads = cards
      .filter(({ tag }) => /\{\s*\.\.\./.test(tag))
      .map(({ file, tag }) => `${relative(sourceRoot, file)}: ${tag.replace(/\s+/g, " ")}`);

    expect(spreads).toEqual([]);

    const legacyFiles = [
      ...new Set(
        cards
          .filter(({ tag }) => !/\bpadded\s*=\s*\{\s*false\s*\}/.test(tag))
          .map(({ file }) => file),
      ),
    ];
    const legacyCount = cards.filter(({ tag }) => !/\bpadded\s*=\s*\{\s*false\s*\}/.test(tag)).length;

    // Measured baseline: 66 `<Card>` call sites across 21 production files were written
    // against the uniform `p-6` box. Consumer migration happens per screen in the later
    // design-alignment slices; this guard only forbids the legacy form from growing.
    // Fewer is progress (lower this ceiling in the same change). T11 moved the public
    // dashboard onto the structural form, which took the legacy form to 62 call sites in 20
    // files. T12/T13 then rebuilt the public matches screen, the tournaments list and the
    // five tournament detail routes onto the structural form, which took the legacy form to
    // 41 call sites in 13 files. T14/T15 rebuilt the teams and players lists, added the
    // `Rendimiento ÚLTIMOS 5` card and replaced the player detail's KPI cards with
    // `KpiGrid`/`Kpi` while moving its two lower cards onto the structural form, which took
    // the legacy form to 35 call sites in 12 files, so both ceilings were lowered to the
    // measured values. T16 converted the live screen's three legacy Cards to the structural
    // form (its new cards already are structural), which took the legacy form to 32 call
    // sites in 11 files, so both ceilings were lowered to the measured values again. T17's
    // admin alignment added only structural cards and converted no legacy one, so the legacy
    // form stays at its measured 32/11 and neither ceiling moves. T18 aligned the admin
    // tournament screens and converted every uniform-padding card it touched to the structural
    // form (the three content tabs' header/panel/leaderboard cards and the list's own card are
    // structural now), which took the legacy form to 24 call sites in 8 files, so both ceilings
    // were lowered to the measured values. T19 then aligned the admin team screens (the list,
    // the restructured create form and the four new detail routes): every card it added or
    // rewrote is structural, so the measured total moved to 81 across 35 production files and
    // the floors move with it, while the legacy form stays at its measured 24/8 and neither
    // ceiling moves.
    // The polish slice that flipped `InfoRow` to the design's label emphasis also brought the
    // scoring screen's last hand-rolled fallback onto the structural form (`Card padded={false}`
    // + `EmptyState` instead of a uniform-padding Card carrying its own `<h1>`), which took the
    // legacy form to 23 call sites. The file count is unchanged (that screen keeps five other
    // uniform-padding Cards), so only the count ceiling drops, to its measured value.
    expect(legacyCount).toBeLessThanOrEqual(23);
    expect(legacyFiles.length).toBeLessThanOrEqual(8);
  });

  it("keeps a single form-field concept in the primitives layer", () => {
    // The old `FormField` wrapper was retired in favour of `Field`; any surviving
    // reference means two competing field concepts are back. The primitive now lives in
    // `Field.tsx`, so the module specifier carries no `FormField` either: this guard
    // matches the identifier alone rather than stripping import paths.
    const offenders = productionTsxFiles(sourceRoot)
      .filter((file) => /\bFormField\b/.test(readFileSync(file, "utf8")))
      .map((file) => relative(sourceRoot, file));

    expect(offenders).toEqual([]);
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

  it("renders the live pill as ordinary labelled content with a reduced-motion safe dot", () => {
    const html = renderToStaticMarkup(<LivePill />);

    // Deliberately NOT a live region. A pill's text is a fixed label ("En vivo", "AUTO · 2s",
    // "SET 3 EN VIVO"), so it announces nothing on mount and nothing later, and on the live
    // match screen two of these sat beside the score region that does change - three live
    // regions for one moving score. The screen-level consequence is pinned in
    // `features/public/LiveMatchPage.test.tsx`.
    expect(html).not.toContain('role="status"');
    expect(html).not.toContain("aria-live");
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

  it("renders an info row with a bold label, a muted value and no trailing border", () => {
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

    // The ASSOCIATION, not just the presence of each class: the design gives the emphasis to
    // the label (frontend/design/html/voleytrack-admin.css:121-122, `.info-row b` bold and
    // `.info-row span` muted), so the label span owns the bold ink and the value span owns the
    // muted one. Both class lists still appear somewhere in the markup either way, so these two
    // fragments are the assertion that actually measures the treatment.
    expect(html).toContain('<span class="font-bold text-vt-text">Duración</span>');
    expect(html).toContain('<span class="text-vt-muted">1h 42m</span>');
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

    // Design source: voleytrack.css:70 / voleytrack-admin.css:73  .btn:hover{border-color:#2d3d5f}
    expect(tokens).toContain("--color-vt-border-hover: #2d3d5f");
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

      for (const literal of ["#0f2a1a", "#86efac", "#14532d", "#2a1e0a", "#fde68a", "#7c4d0a", "#ff6a3d", "#2d3d5f"]) {
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
    // Design source: frontend/design/html/voleytrack-admin.css:244 and :246 — the overlay is
    // `background:rgba(6,10,18,.66)` with a 4px backdrop blur over a `--surface` panel with a
    // `--border` edge and an 18px radius. The overlay colour is the tokenised
    // `--color-vt-overlay` rather than a raw literal.
    expect(html).toContain("bg-vt-overlay");
    expect(html).toContain("bg-vt-surface");
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

  it("applies the design's numeric treatment to numeric table columns", () => {
    const html = renderToStaticMarkup(
      <DataTable
        columns={[
          { header: "Jugador", key: "player" },
          { header: "Pts", key: "points", numeric: true },
        ]}
        getRowKey={(row) => row.player}
        rows={[{ player: "Fernández, M.", points: 142 }]}
      />,
    );

    // Design source: frontend/design/html/voleytrack.css:100
    //   .num{font-family:var(--font-mono);font-variant-numeric:tabular-nums;text-align:right}
    // The design puts `.num` on both the header and the body cell, e.g.
    // frontend/design/html/voleytrack-admin-jugadores.html:54:
    //   <th class="num">Pts</th> … <td class="num">142</td>
    const numericHeader = html.match(/<th[^>]*>Pts/)![0];
    const numericCell = html.match(/<td[^>]*>142</)![0];
    const textCell = html.match(/<td[^>]*>Fernández, M\.</)![0];

    // `tabular-nums` is the whole point: fixed-advance digits keep columns aligned.
    for (const cell of [numericHeader, numericCell]) {
      expect(cell).toContain("font-mono");
      expect(cell).toContain("tabular-nums");
      expect(cell).toContain("text-right");
    }

    // A text column never inherits the numeric treatment: it is the table's first
    // (identity) column and its value is a string, not a measurement.
    expect(textCell).toContain("px-4");
    expect(textCell).not.toContain("font-mono");
    expect(textCell).not.toContain("tabular-nums");
  });

  it("detects a numeric column from the row data and lets a column opt out", () => {
    const html = renderToStaticMarkup(
      <DataTable
        columns={[
          { header: "Equipo", key: "team" },
          { header: "Jugadores", key: "playerCount" },
          { header: "Sets", key: "sets" },
          { header: "PG / PP", key: "record", numeric: false },
          { header: "Acción", key: "action", render: (row) => <b>{row.action}</b> },
        ]}
        getRowKey={(row) => row.team}
        rows={[{ action: "Ver", playerCount: 14, record: "8 / 2", sets: "16-6", team: "UPCN San Juan" }]}
      />,
    );

    // A number in the row data is a measurement, so it gets the design's treatment
    // without the call site restating the utilities.
    const inferred = html.match(/<td[^>]*>14</)![0];
    // A formatted measurement is a string, so the row type cannot prove it is numeric.
    const formatted = html.match(/<td[^>]*>16-6</)![0];
    // An explicit declaration always wins: the design leaves some numeric columns left.
    const optedOut = html.match(/<td[^>]*>8 \/ 2</)![0];
    // A `render` column projects markup, not the row value, so its type proves nothing.
    const rendered = html.match(/<td[^>]*><b>Ver<\/b></)![0];

    expect(inferred).toContain("tabular-nums");
    expect(inferred).toContain("font-mono");
    expect(inferred).toContain("text-right");
    expect(formatted).not.toContain("tabular-nums");
    expect(optedOut).not.toContain("tabular-nums");
    expect(rendered).not.toContain("tabular-nums");

    // The design's first column is the row's identity (`#`, Equipo, Jugador in every
    // design table that uses `.num`), which the design never marks `.num` even when its
    // cells are numbers, as in the standings (`voleytrack-torneos.html`: `<th>#</th>`, then
    // `<th class="num">PJ</th>`). An explicit `numeric` still overrides that reading.
    const ranked = renderToStaticMarkup(
      <DataTable
        columns={[
          { header: "#", key: "rank" },
          { header: "Pts", key: "points" },
        ]}
        getRowKey={(row) => row.points}
        rows={[{ points: 142, rank: 1 }]}
      />,
    );

    expect(ranked.match(/<td[^>]*>1</)![0]).not.toContain("tabular-nums");
    expect(ranked.match(/<td[^>]*>142</)![0]).toContain("tabular-nums");
    expect(ranked.match(/<th[^>]*>#/)![0]).not.toContain("tabular-nums");
    expect(ranked.match(/<th[^>]*>Pts/)![0]).toContain("tabular-nums");
  });

  it("exposes the design's numeric treatment as one whole constant and an inline component", () => {
    // The triplet is only useful whole: mono digits without `tabular-nums` advance by
    // glyph width, which is the misalignment the design treatment exists to prevent.
    // Pinning the exact value makes a partial edit (dropping tabular-nums) fail here.
    expect(numClasses).toBe("font-mono tabular-nums text-right");

    const html = renderToStaticMarkup(<Num className="text-vt-muted">1.542</Num>);

    expect(html).toContain("1.542");
    expect(html).toContain("font-mono");
    expect(html).toContain("tabular-nums");
    expect(html).toContain("text-right");
    expect(html).toContain("text-vt-muted");
  });

  it("keeps the numeric triplet in one owner instead of hand-writing it across the tree", () => {
    // `numClasses` (Num.tsx) is the single owner of `.num`. A production class string
    // that spells all three utilities out again is a copy that can silently drift —
    // and the drift that matters is a missing `tabular-nums`. The walk must find
    // something, otherwise the guard is passing because it scanned nothing.
    const candidates = productionTsxFiles(sourceRoot).filter((file) => !file.endsWith("Num.tsx"));

    expect(candidates.length).toBeGreaterThan(0);

    const offenders = candidates.flatMap((file) => {
      const source = stripComments(readFileSync(file, "utf8"));

      return [...source.matchAll(/["'`]([^"'`]*)["'`]/g)]
        .map(([, literal]) => literal)
        .filter((literal) => {
          const tokens = literal.split(/[\s${}]+/);
          return (
            tokens.includes("font-mono") &&
            tokens.includes("tabular-nums") &&
            tokens.includes("text-right")
          );
        })
        .map((literal) => `${relative(sourceRoot, file)}: ${literal}`);
    });

    expect(offenders).toEqual([]);
  });

  it("renders semantic badges and the default page header hierarchy", () => {
    const html = renderToStaticMarkup(
      <>
        <Badge variant="success">Live</Badge>
        <Badge variant="ok">Activo</Badge>
        <Badge variant="warn">Pendiente</Badge>
        <Badge>Borrador</Badge>
        <PageHeader actions={<Button>Add match</Button>} description="Season overview" title="Matches" />
      </>,
    );

    // Design source: frontend/design/html/voleytrack.css:101-103 / voleytrack-admin.css:86-88
    //   .badge{font-family:var(--font-mono);font-size:10px;font-weight:800;letter-spacing:.06em;
    //          text-transform:uppercase;padding:5px 8px;border-radius:999px;
    //          border:1px solid var(--border);background:var(--bg);color:var(--muted)}
    expect(html).toContain("font-mono");
    expect(html).toContain("text-[10px]");
    expect(html).toContain("font-extrabold");
    expect(html).toContain("uppercase");
    expect(html).toContain("tracking-[0.06em]");
    expect(html).toContain("px-2");
    expect(html).toContain("py-[5px]");
    expect(html).toContain("rounded-full");
    expect(html).toContain("border");
    expect(html).toContain("border-vt-border");
    expect(html).toContain("bg-vt-background");
    expect(html).toContain("text-vt-muted");
    expect(html).toContain("Borrador");
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
    // Design source: frontend/design/html/voleytrack.css:66
    //   .page-head h1{font-size:28px;font-weight:900;letter-spacing:-0.02em;margin:0;line-height:1}
    expect(html).toMatch(/<h1 class="[^"]*text-\[28px\][^"]*font-black[^"]*tracking-\[-0\.02em\][^"]*">Matches<\/h1>/);
    expect(html).toContain("Season overview");
    // Design source: voleytrack.css:67
    //   .page-head p{color:var(--muted);font-size:13px;margin:6px 0 0;max-width:60ch}
    expect(html).toMatch(
      /<p class="[^"]*mt-1\.5[^"]*max-w-\[60ch\][^"]*text-\[13px\][^"]*text-vt-muted[^"]*">Season overview<\/p>/,
    );
    expect(html).toContain("Add match");
    expect(html).toMatch(/<header class="[^"]*flex-col[^"]*items-stretch[^"]*sm:flex-row[^"]*sm:items-start[^"]*sm:justify-between/);
    expect(html).toMatch(/<div class="[^"]*w-full[^"]*min-w-0[^"]*flex-wrap[^"]*sm:w-auto[^"]*sm:justify-end">.*Add match/);
  });

  it("renders one design page-head treatment for both header variants", () => {
    const compact = renderToStaticMarkup(
      <PageHeader
        description="Live matches and tournament summaries."
        title="Public dashboard"
        variant="compact"
      />,
    );
    const standard = renderToStaticMarkup(
      <PageHeader
        description="Live matches and tournament summaries."
        title="Public dashboard"
      />,
    );

    // Design source: frontend/design/html/voleytrack.css:66-67. The design defines exactly
    // one `.page-head` heading (28px / 900 / -0.02em) and one description (13px, --muted,
    // 6px above, 60ch measure) across frontend/design/html/*.html, so `compact` must not
    // render a 26px heading any more.
    expect(compact).toMatch(/<h1 class="[^"]*text-\[28px\][^"]*font-black[^"]*tracking-\[-0\.02em\][^"]*">Public dashboard<\/h1>/);
    expect(compact).toMatch(
      /<p class="[^"]*mt-1\.5[^"]*max-w-\[60ch\][^"]*text-\[13px\][^"]*text-vt-muted[^"]*">Live matches and tournament summaries.<\/p>/,
    );
    expect(compact).not.toContain("text-[26px]");
    expect(compact).not.toContain("text-[32px]");
    expect(compact).not.toContain('variant="compact"');
    expect(compact).toBe(standard);
  });

  it("renders the design's opt-in match-source eyebrow and headings keep no focus target by default", () => {
    const plain = renderToStaticMarkup(<PageHeader title="Partidos" />);
    const withEyebrow = renderToStaticMarkup(
      <PageHeader
        description="Torneo · fecha"
        eyebrow="Preparación del partido"
        headingRef={{ current: null }}
        title="Setup"
      />,
    );

    // The default header is unchanged: no eyebrow paragraph and no tabindex on the h1, so the
    // 30 screens that render one keep the attribute-free heading core.test.tsx pins elsewhere.
    expect(plain).not.toContain("tabindex");
    expect(plain).not.toContain("match-source");

    // Design source: frontend/design/html/voleytrack-admin.css:201
    //   .match-source{font-family:var(--font-mono);font-size:9px;font-weight:800;
    //                 letter-spacing:.06em;text-transform:uppercase;color:var(--muted-2)}
    // and voleytrack-planillero.html:25, where the eyebrow paragraph sits ABOVE the h1 inside the
    // same `.page-head` column, with `.page-head p{margin:6px 0 0}` (voleytrack-admin.css:70)
    // giving it the same 6px offset as the description below.
    expect(withEyebrow).toMatch(
      /<p class="[^"]*mt-1\.5[^"]*font-mono[^"]*text-\[9px\][^"]*font-extrabold[^"]*tracking-\[0\.06em\][^"]*text-vt-muted-2[^"]*uppercase[^"]*">Preparación del partido<\/p>/,
    );
    expect(withEyebrow.indexOf("Preparación del partido")).toBeLessThan(withEyebrow.indexOf("<h1"));

    // A heading is a programmatic focus target only when the caller supplies a ref, because the
    // design's planillero focuses this exact h1 (`tabindex="-1"`, voleytrack-planillero.html:25).
    expect(withEyebrow).toMatch(/<h1 class="[^"]*text-\[28px\][^"]*"[^>]*tabindex="-1"[^>]*>Setup<\/h1>/);
  });
});
