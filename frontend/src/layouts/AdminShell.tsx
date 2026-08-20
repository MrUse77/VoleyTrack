import { Outlet } from "@tanstack/react-router";
import { Sidebar, type SidebarNavigationGroup } from "../components/navigation/Sidebar";

interface AdminShellProps {
  currentPath: string;
  navigation: SidebarNavigationGroup[];
  roleLabel: string;
}

const scorerPathSuffixes = [
  "/matches/setup",
  "/scoring",
  "/point-entry",
  "/summary",
] as const;

function hasPathSuffix(currentPath: string, suffix: string) {
  return currentPath.endsWith(suffix);
}

// eslint-disable-next-line react-refresh/only-export-components
export function isScorerPath(currentPath: string) {
  return (
    currentPath === "/planillero" ||
    scorerPathSuffixes.some((suffix) => hasPathSuffix(currentPath, suffix))
  );
}

function getAdminPageMeta(currentPath: string) {
  if (currentPath === "/planillero") {
    return {
      title: "Panel de planillero",
      subtitle: "Operación de partido",
    };
  }

  if (hasPathSuffix(currentPath, "/matches/setup")) {
    return {
      title: "Configurar partido",
      subtitle: "Admin / Nuevo partido",
    };
  }

  if (
    hasPathSuffix(currentPath, "/scoring") ||
    hasPathSuffix(currentPath, "/point-entry")
  ) {
    return {
      title: "Registrar puntuación",
      subtitle: "Planillero / Partido en vivo",
    };
  }

  if (hasPathSuffix(currentPath, "/summary")) {
    return {
      title: "Resumen del partido",
      subtitle: "Admin / Resultados",
    };
  }

  if (currentPath.includes("/staff")) {
    return {
      title: "Staff y planilleros",
      subtitle: "Administración",
    };
  }

  if (currentPath.includes("/settings")) {
    return {
      title: "Configuración",
      subtitle: "Administración",
    };
  }

  if (currentPath.includes("/matches")) {
    return {
      title: "Partidos",
      subtitle: "Gestión de competición",
    };
  }

  if (currentPath.includes("/tournaments")) {
    return {
      title: "Torneos",
      subtitle: "Gestión de competición",
    };
  }

  if (currentPath.includes("/teams")) {
    return {
      title: "Equipos",
      subtitle: "Gestión de competición",
    };
  }

  if (currentPath.includes("/players")) {
    return {
      title: "Jugadores",
      subtitle: "Gestión de competición",
    };
  }

  return {
    title: "Administración",
    subtitle: "Gestión de competición",
  };
}

function AdminHeader({ currentPath }: { currentPath: string }) {
  const { title, subtitle } = getAdminPageMeta(currentPath);

  return (
    <header
      aria-label="Encabezado de administración"
      className="flex min-h-[72px] flex-wrap items-center gap-x-4 gap-y-3 border-b border-vt-border bg-vt-panel px-4 py-3 sm:px-6 md:h-[72px] md:flex-nowrap md:py-0"
    >
      <div className="min-w-0 flex-1 basis-full md:basis-auto">
        <h1 className="truncate text-xl font-bold leading-tight text-vt-text">{title}</h1>
        <p className="truncate text-[11px] text-vt-muted">{subtitle}</p>
      </div>

      <form
        aria-label="Buscar en administración"
        className="flex h-9 w-full min-w-0 items-center rounded-[10px] bg-vt-surface px-4 md:w-[300px] md:shrink-0"
        onSubmit={(event) => event.preventDefault()}
        role="search"
      >
        <label className="sr-only" htmlFor="admin-shell-search">
          Buscar en administración
        </label>
        <input
          aria-label="Buscar en administración"
          className="w-full min-w-0 bg-transparent text-xs text-vt-text outline-none placeholder:text-vt-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
          id="admin-shell-search"
          placeholder="Buscar..."
          type="search"
        />
      </form>

      <a
        className="inline-flex h-9 shrink-0 items-center justify-center rounded-[10px] bg-vt-surface px-5 text-xs font-bold text-vt-accent transition hover:bg-vt-raised focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vt-accent"
        href="/matches"
      >
        Ver sitio público
      </a>
    </header>
  );
}

export function AdminShell({ currentPath, navigation, roleLabel }: AdminShellProps) {
  return (
    <div className="flex min-h-screen min-w-0 flex-col bg-vt-background text-vt-text md:flex-row">
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-vt-accent focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-vt-background"
        href="#admin-main-content"
      >
        Saltar al contenido
      </a>
      <Sidebar
        brandSubtitle={roleLabel}
        currentPath={currentPath}
        navigation={navigation}
        roleLabel={roleLabel}
        variant="admin"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader currentPath={currentPath} />
        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8" id="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
