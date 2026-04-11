import { TestBed } from '@angular/core/testing';
import { ScreenOneMatchCenterComponent } from './screen-one-match-center.component';
import type { ScreenOneMatchesVm } from '../screen-one.models';

describe('ScreenOneMatchCenterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenOneMatchCenterComponent],
    }).compileComponents();
  });

  it('renders filter tabs and every category when ALL is active', () => {
    const fixture = TestBed.createComponent(ScreenOneMatchCenterComponent);
    fixture.componentInstance.matchCenter = {
      tag: 'Matches',
      title: 'Match Center',
      subtitle: 'Live scoreboard and category browser',
      filters: [
        { label: 'ALL', active: true },
        { label: 'LIVE' },
        { label: 'UPCOMING' },
        { label: 'RESULTS' },
      ],
      sections: [
        {
          category: 'LIVE',
          title: 'Live',
          emptyState: 'No live matches available.',
          items: [
            {
              league: 'VNL',
              teams: ['Brazil', 'Italy'],
              score: '2 - 1',
              status: 'Set 4 · 24-22',
              stage: 'Match point',
            },
          ],
        },
        {
          category: 'UPCOMING',
          title: 'Upcoming',
          emptyState: 'No upcoming matches scheduled.',
          items: [
            {
              league: 'Pool A',
              teams: ['USA', 'POL'],
              score: '14:00',
              status: 'Scheduled',
              stage: 'Arena 2',
            },
          ],
        },
        {
          category: 'RESULTS',
          title: 'Results',
          emptyState: 'No results available yet.',
          items: [
            {
              league: 'World Cup',
              teams: ['CAN', 'GER'],
              score: '3 - 1',
              status: 'Completed',
              stage: 'Final',
            },
          ],
        },
      ],
    } satisfies ScreenOneMatchesVm;

    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.textContent).toContain('ALL');
    expect(root.textContent).toContain('LIVE');
    expect(root.textContent).toContain('UPCOMING');
    expect(root.textContent).toContain('RESULTS');
    expect(root.textContent).toContain('Brazil vs Italy');
    expect(root.textContent).toContain('USA vs POL');
    expect(root.textContent).toContain('CAN vs GER');
    expect(root.textContent).not.toContain('Ver más');
    expect(root.textContent).not.toContain('Featured match');
  });

  it('shows only the live category when LIVE is selected', () => {
    const fixture = TestBed.createComponent(ScreenOneMatchCenterComponent);
    fixture.componentInstance.matchCenter = {
      tag: 'Matches',
      title: 'Match Center',
      subtitle: 'Live scoreboard and category browser',
      filters: [
        { label: 'ALL' },
        { label: 'LIVE', active: true },
        { label: 'UPCOMING' },
        { label: 'RESULTS' },
      ],
      sections: [
        {
          category: 'LIVE',
          title: 'Live',
          emptyState: 'No live matches available.',
          items: [
            {
              league: 'VNL',
              teams: ['Brazil', 'Italy'],
              score: '2 - 1',
              status: 'Set 4 · 24-22',
              stage: 'Match point',
            },
          ],
        },
        {
          category: 'UPCOMING',
          title: 'Upcoming',
          emptyState: 'No upcoming matches scheduled.',
          items: [
            {
              league: 'Pool A',
              teams: ['USA', 'POL'],
              score: '14:00',
              status: 'Scheduled',
              stage: 'Arena 2',
            },
          ],
        },
      ],
    } satisfies ScreenOneMatchesVm;

    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.textContent).toContain('Brazil vs Italy');
    expect(root.textContent).not.toContain('USA vs POL');
    expect(root.textContent).not.toContain('Ver más');
  });
});
