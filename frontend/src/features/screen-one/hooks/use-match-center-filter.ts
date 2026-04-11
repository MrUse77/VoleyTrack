import { useEffect, useMemo, useState } from "react";
import type {
  ScreenOneMatchCategory,
  ScreenOneMatchSectionVm,
  ScreenOneMatchesVm,
} from "../screen-one.models";

type MatchFilter = "ALL" | ScreenOneMatchCategory;

const FILTER_ORDER: MatchFilter[] = ["ALL", "LIVE", "UPCOMING", "RESULTS"];

export function useMatchCenterFilter(matchCenter: ScreenOneMatchesVm) {
  const initialFilter = useMemo<MatchFilter>(() => {
    const activeFilter = matchCenter.filters
      .find((filter) => filter.active)
      ?.label?.toUpperCase();
    return FILTER_ORDER.includes(activeFilter as MatchFilter)
      ? (activeFilter as MatchFilter)
      : "ALL";
  }, [matchCenter.filters]);

  const [activeFilter, setActiveFilter] = useState<MatchFilter>(initialFilter);

  useEffect(() => {
    setActiveFilter(initialFilter);
  }, [initialFilter]);

  const currentFilter = activeFilter;

  const normalizeFilter = (filter: string): MatchFilter => {
    const normalized = filter.toUpperCase();
    return FILTER_ORDER.includes(normalized as MatchFilter)
      ? (normalized as MatchFilter)
      : "ALL";
  };

  const visibleSections = useMemo<ScreenOneMatchSectionVm[]>(() => {
    if (currentFilter === "ALL") return matchCenter.sections;
    return matchCenter.sections.filter(
      (section) => section.category === currentFilter,
    );
  }, [currentFilter, matchCenter.sections]);

  const isActive = (filter: MatchFilter) => currentFilter === filter;

  return {
    activeFilter: currentFilter,
    setFilter: setActiveFilter,
    normalizeFilter,
    visibleSections,
    isActive,
  };
}
