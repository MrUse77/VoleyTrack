import { SectionShell } from "../components/ui/SectionShell";

interface PlaceholderPageProps {
  title: string;
  description?: string;
  eyebrow?: string;
}

export function PlaceholderPage({
  title,
  description = "This route is wired, but its screen is not implemented yet.",
  eyebrow = "Not implemented",
}: PlaceholderPageProps) {
  return (
    <SectionShell eyebrow={eyebrow} title={title} description={description}>
      <div className="rounded-[20px] border border-dashed border-vt-border bg-vt-panel px-5 py-12 text-sm leading-6 text-vt-muted">
        This section is reserved for the next rebuild batch. The runtime route is
        already in place, but its screen is not implemented yet.
      </div>
    </SectionShell>
  );
}
