import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "./Button";
import { Card } from "./Card";
import { FormField } from "./FormField";
import { IconButton } from "./IconButton";
import { Badge } from "./Badge";
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
