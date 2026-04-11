import { useEffect, useMemo, useState } from "react";
import type { MatchCategory, MatchSectionVm, MatchesBrowserVm } from "../matches.models";

type MatchFilter = "ALL" | MatchCategory;

const FILTER_ORDER: MatchFilter[] = ["ALL", "LIVE", "UPCOMING", "RESULTS"];

export function useMatchCenterFilter(matchCenter: MatchesBrowserVm) {
  const initialFilter = useMemo<MatchFilter>(() => {
    const activeFilter = matchCenter.filters.find((filter) => filter.active)?.label?.toUpperCase();
    return FILTER_ORDER.includes(activeFilter as MatchFilter)
      ? (activeFilter as MatchFilter)
      : "ALL";
  }, [matchCenter.filters]);

  const [activeFilter, setActiveFilter] = useState<MatchFilter>(initialFilter);

  useEffect(() => {
    setActiveFilter(initialFilter);
  }, [initialFilter]);

  const normalizeFilter = (filter: string): MatchFilter => {
    const normalized = filter.toUpperCase();
    return FILTER_ORDER.includes(normalized as MatchFilter)
      ? (normalized as MatchFilter)
      : "ALL";
  };

  const visibleSections = useMemo<MatchSectionVm[]>(() => {
    if (activeFilter === "ALL") return matchCenter.sections;
    return matchCenter.sections.filter((section) => section.category === activeFilter);
  }, [activeFilter, matchCenter.sections]);

  const isActive = (filter: MatchFilter) => activeFilter === filter;

  return {
    activeFilter,
    setFilter: setActiveFilter,
    normalizeFilter,
    visibleSections,
    isActive,
  };
}
