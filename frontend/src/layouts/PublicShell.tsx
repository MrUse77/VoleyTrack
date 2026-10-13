import { Outlet } from "@tanstack/react-router";
import { NavigationLink as Link } from "../components/navigation/NavigationLink";
import { Sidebar, type SidebarNavigationGroup } from "../components/navigation/Sidebar";

interface PublicShellProps {
  currentPath: string;
  navigation: SidebarNavigationGroup[];
  roleLabel: string;
}

function getPublicPageMeta(currentPath: string) {
  if (currentPath.startsWith("/live")) {
    return {
      title: "En vivo",
      subtitle: "Partido en directo",
    };
  }

  if (currentPath.startsWith("/matches")) {
    return {
      title: "Partidos",
      subtitle: "Calendario y resultados en vivo",
    };
  }

  if (currentPath.startsWith("/tournaments")) {
    return {
      title: "Torneos",
      subtitle: "Competiciones y resultados",
    };
  }

  if (currentPath.startsWith("/teams")) {
    return {
      title: "Equipos",
      subtitle: "Equipos y plantillas",
    };
  }

  if (currentPath.startsWith("/players")) {
    return {
      title: "Jugadores",
      subtitle: "Jugadores registrados",
    };
  }

  return {
    title: "Resultados en vivo",
    subtitle: "Vista pública para espectadores",
  };
}

function PublicHeader({ currentPath }: { currentPath: string }) {
  const { title, subtitle } = getPublicPageMeta(currentPath);

  return (
    <header
      aria-label="Encabezado público"
      className="flex min-h-[72px] flex-wrap items-center gap-x-4 gap-y-3 border-b border-vt-border bg-vt-panel px-4 py-3 sm:px-6 md:h-[72px] md:flex-nowrap md:py-0"
    >
      <div className="min-w-0 flex-1 basis-full md:basis-auto">
        <h1 className="truncate text-xl font-bold leading-tight text-vt-text">{title}</h1>
        <p className="truncate text-[11px] text-vt-muted">{subtitle}</p>
      </div>

      <form
        aria-label="Buscar en VoleyTrack"
        className="flex h-9 w-full min-w-0 items-center rounded-[10px] bg-vt-surface px-4 md:w-[300px] md:shrink-0"
        onSubmit={(event) => event.preventDefault()}
        role="search"
      >
        <label className="sr-only" htmlFor="public-shell-search">
          Buscar partido, torneo o equipo
        </label>
        <input
          aria-label="Buscar partido, torneo o equipo"
          className="w-full min-w-0 bg-transparent text-xs text-vt-text outline-none placeholder:text-vt-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
          id="public-shell-search"
          placeholder="Buscar partido, torneo o equipo"
          type="search"
        />
      </form>

      <Link
        className="inline-flex h-9 shrink-0 items-center justify-center rounded-[10px] bg-vt-accent px-5 text-xs font-bold text-vt-background transition hover:brightness-[1.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
        search={{ status: "live" }}
        to="/matches"
      >
        Ver en vivo
      </Link>
    </header>
  );
}

export function PublicShell({ currentPath, navigation, roleLabel }: PublicShellProps) {
  return (
    <div className="flex min-h-screen min-w-0 flex-col bg-vt-background text-vt-text md:flex-row">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-vt-accent focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-vt-background"
        href="#public-main-content"
      >
        Saltar al contenido
      </a>
      <Sidebar
        brandSubtitle="Resultados en vivo"
        currentPath={currentPath}
        navigation={navigation}
        roleLabel={roleLabel}
        showCoverage
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <PublicHeader currentPath={currentPath} />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8" id="public-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
