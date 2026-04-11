import { Outlet } from "@tanstack/react-router";
import { ShellFooter } from "../components/ShellFooter";
import { ShellTopbar } from "../components/ShellTopbar";
import { ShellUtilityBar } from "../components/ShellUtilityBar";

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-vt-background text-vt-text">
      <ShellTopbar />
      <ShellUtilityBar />

      <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 lg:px-6 xl:py-8">
        <Outlet />
      </main>

      <ShellFooter />
    </div>
  );
}
