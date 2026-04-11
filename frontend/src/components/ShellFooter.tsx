import { APP_SHELL_FOOTER } from "../shared/app-shell.content";
import { Surface } from "./ui/Surface";

interface ShellFooterProps {
  className?: string;
}

export const ShellFooter = ({ className = "" }: ShellFooterProps) => {
  return (
    <footer className={`border-t border-vt-border bg-vt-panel ${className}`.trim()}>
      <div className="mx-auto grid w-full max-w-[1600px] gap-8 px-4 py-10 md:grid-cols-[1.2fr_1fr] md:px-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white">
            <img
              src="/icon.svg"
              alt="VOLLEYTRACK"
              width="25"
              height="25"
              className="shrink-0"
            />
            <div>
              <p className="text-lg font-black uppercase tracking-[-0.05em] text-white">
                VOLLEY<span className="text-vt-accent">TRACK</span>
              </p>
              <p className="text-xs uppercase tracking-[0.26em] text-vt-muted">
                {APP_SHELL_FOOTER.brand.subtitle}
              </p>
            </div>
          </div>

          <p className="max-w-xl text-sm leading-6 text-vt-muted">
            {APP_SHELL_FOOTER.legal}
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {APP_SHELL_FOOTER.columns.map((column) => (
            <Surface key={column.title} className="p-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-vt-muted">
                {column.title}
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-vt-text/80">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      className="transition hover:text-white hover:underline"
                      href={link.href}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Surface>
          ))}
        </div>
      </div>
    </footer>
  );
};
