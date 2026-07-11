import { readFileSync } from "node:fs";
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

const tokensPath = fileURLToPath(new URL("../../styles/tokens.css", import.meta.url));

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

  it("renders a raised card with its content slot", () => {
    const html = renderToStaticMarkup(<Card>Card content</Card>);

    expect(html).toContain("Card content");
    expect(html).toContain("bg-vt-raised");
    expect(html).toContain("border-vt-raised-border");
    expect(html).toContain("rounded-2xl");
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

  it("renders semantic badges and page header content slots", () => {
    const html = renderToStaticMarkup(
      <>
        <Badge variant="success">Live</Badge>
        <PageHeader actions={<Button>Add match</Button>} description="Season overview" title="Matches" />
      </>,
    );

    expect(html).toContain("bg-vt-success/20");
    expect(html).toContain("Matches");
    expect(html).toContain("Season overview");
    expect(html).toContain("Add match");
  });
});
