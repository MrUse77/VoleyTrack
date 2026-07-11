import { Outlet } from "@tanstack/react-router";
import { Sidebar, type SidebarNavigationGroup } from "../components/navigation/Sidebar";

interface AdminShellProps {
  currentPath: string;
  navigation: SidebarNavigationGroup[];
  roleLabel: string;
}

export function AdminShell({ currentPath, navigation, roleLabel }: AdminShellProps) {
  return (
    <div className="flex min-h-screen min-w-[1440px] bg-vt-panel text-vt-text">
      <Sidebar currentPath={currentPath} navigation={navigation} roleLabel={roleLabel} />
      <main className="min-w-0 flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
