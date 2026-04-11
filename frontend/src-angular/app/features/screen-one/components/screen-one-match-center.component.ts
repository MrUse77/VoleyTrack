import { Component, Input } from '@angular/core';
import type {
  ScreenOneMatchCategory,
  ScreenOneMatchSectionVm,
  ScreenOneMatchesVm,
} from '../screen-one.models';

@Component({
  selector: 'app-screen-one-match-center',
  templateUrl: './screen-one-match-center.component.html',
  styleUrl: './screen-one-match-center.component.scss',
})
export class ScreenOneMatchCenterComponent {
  @Input({ required: true }) matchCenter!: ScreenOneMatchesVm;

  activeFilter: 'ALL' | ScreenOneMatchCategory = 'ALL';

  readonly filterOrder: Array<'ALL' | ScreenOneMatchCategory> = [
    'ALL',
    'LIVE',
    'UPCOMING',
    'RESULTS',
  ];

  resolveFilter(filter: string): 'ALL' | ScreenOneMatchCategory {
    const normalized = filter.toUpperCase();

    return this.filterOrder.includes(normalized as 'ALL' | ScreenOneMatchCategory)
      ? (normalized as 'ALL' | ScreenOneMatchCategory)
      : 'ALL';
  }

  setFilter(filter: 'ALL' | ScreenOneMatchCategory) {
    this.activeFilter = filter;
  }

  currentFilter(): 'ALL' | ScreenOneMatchCategory {
    return (
      (this.matchCenter.filters.find((filter) => filter.active)?.label?.toUpperCase() as
        | 'ALL'
        | ScreenOneMatchCategory
        | undefined) ?? this.activeFilter
    );
  }

  isActive(filter: 'ALL' | ScreenOneMatchCategory): boolean {
    return this.currentFilter() === filter;
  }

  visibleSections(): ScreenOneMatchSectionVm[] {
    const filter = this.currentFilter();

    if (filter === 'ALL') {
      return this.matchCenter.sections;
    }

    return this.matchCenter.sections.filter((section) => section.category === filter);
  }
}
