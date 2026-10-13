import type { ReactNode } from "react";

export type TabBarTab = {
  disabled?: boolean;
  label: ReactNode;
  value: string;
};

type TabBarProps = {
  "aria-label": string;
  onChange: (value: string) => void;
  tabs: TabBarTab[];
  value: string;
};

export function TabBar({ "aria-label": ariaLabel, onChange, tabs, value }: TabBarProps) {
  return (
    <div aria-label={ariaLabel} className="inline-flex gap-1 rounded-xl border border-vt-border bg-vt-panel p-1" role="tablist">
      {tabs.map((tab) => {
        const isActive = tab.value === value;

        return (
          <button
            aria-selected={isActive}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${isActive ? "bg-vt-accent text-vt-background" : "text-vt-muted hover:bg-vt-surface hover:text-vt-text"}`}
            disabled={tab.disabled}
            key={tab.value}
            onClick={() => onChange(tab.value)}
            role="tab"
            type="button"
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
