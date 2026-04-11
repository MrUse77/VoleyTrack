import { TestBed } from '@angular/core/testing';
import { ScreenOneMatchesComponent } from './screen-one-matches.component';
import type { ScreenOneMatchesVm } from '../screen-one.models';

describe('ScreenOneMatchesComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenOneMatchesComponent],
    }).compileComponents();
  });

  it('renders the Match Center hero, tabs, featured match, and secondary cards', () => {
    const fixture = TestBed.createComponent(ScreenOneMatchesComponent);
    fixture.componentInstance.matches = {
      tag: 'Matches',
      title: 'Match Center',
      subtitle: 'Live scoreboard and editorial spotlight',
      ctaLabel: 'Ver más',
      filters: [{ label: 'All', active: true }, { label: 'Live' }, { label: 'Upcoming' }],
      featuredMatch: {
        league: 'VNL 2024',
        teams: ['Brazil', 'Italy'],
        score: '2 - 1',
        status: 'Set 4 · 24-22',
        stage: 'Match point',
        badge: 'LIVE',
      },
      secondaryMatches: [
        {
          league: 'World Cup',
          teams: ['USA', 'Poland'],
          score: '1 - 1',
          status: 'Set 3 · 18-19',
          stage: 'Live',
        },
        {
          league: 'CEV Cup',
          teams: ['France', 'Japan'],
          score: '0 - 0',
          status: 'Warm-up',
          stage: 'Starting soon',
        },
      ],
      emptyState: 'No secondary matches available.',
    } satisfies ScreenOneMatchesVm;

    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const activeFilter = root.querySelector('button[aria-current="page"]');

    expect(root.textContent).toContain('Match Center');
    expect(root.textContent).toContain('Brazil vs Italy');
    expect(root.textContent).toContain('Match point');
    expect(root.textContent).toContain('USA vs Poland');
    expect(root.textContent).toContain('France vs Japan');
    expect(activeFilter?.textContent?.trim()).toContain('All');
    expect(root.textContent).not.toContain('No secondary matches available.');
  });

  it('falls back to an empty state when no secondary cards are provided', () => {
    const fixture = TestBed.createComponent(ScreenOneMatchesComponent);
    fixture.componentInstance.matches = {
      tag: 'Matches',
      title: 'Match Center',
      subtitle: 'Live scoreboard and editorial spotlight',
      ctaLabel: 'Ver más',
      filters: [{ label: 'All', active: true }],
      featuredMatch: {
        league: 'VNL 2024',
        teams: ['Brazil', 'Italy'],
        score: '2 - 1',
        status: 'Set 4 · 24-22',
        stage: 'Match point',
        badge: 'LIVE',
      },
      secondaryMatches: [],
      emptyState: 'No secondary matches available.',
    } satisfies ScreenOneMatchesVm;

    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('No secondary matches available.');
    expect(root.textContent).toContain('Brazil vs Italy');
    expect(root.textContent).not.toContain('USA vs Poland');
  });
});
