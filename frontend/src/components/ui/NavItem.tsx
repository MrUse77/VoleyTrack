import { Link } from "@tanstack/react-router";
import type { AppNavItem } from "../../shared/navigation.models";

interface NavItemProps {
  item: AppNavItem;
}

export function NavItem({ item }: NavItemProps) {
  return (
    <Link
      to={item.href}
      activeProps={{ className: "border-vt-accent bg-white/5 text-white" }}
      inactiveProps={{ className: "border-transparent text-vt-muted hover:text-white" }}
      className="border-b-2 px-3 py-5 text-sm font-bold uppercase tracking-[0.08em] transition"
    >
      {item.label}
    </Link>
  );
}
