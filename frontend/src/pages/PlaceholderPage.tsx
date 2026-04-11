import { SectionShell } from "../components/ui/SectionShell";

interface PlaceholderPageProps {
  title: string;
  description: string;
  eyebrow?: string;
}

export function PlaceholderPage({
  title,
  description,
  eyebrow = "Coming soon",
}: PlaceholderPageProps) {
  return (
    <SectionShell eyebrow={eyebrow} title={title} description={description}>
      <div className="rounded-[20px] border border-dashed border-white/10 bg-black/20 px-5 py-12 text-sm leading-6 text-vt-muted">
        This section is reserved for the next rebuild batch. The runtime route is
        already in place, so the next step is replacing this scaffold with real
        product content.
      </div>
    </SectionShell>
  );
}
