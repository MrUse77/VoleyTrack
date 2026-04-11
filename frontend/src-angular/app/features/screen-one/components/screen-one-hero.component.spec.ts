import { TestBed } from '@angular/core/testing';
import { ScreenOneHeroComponent } from './screen-one-hero.component';
import type { ScreenOneHeroVm } from '../screen-one.models';

describe('ScreenOneHeroComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenOneHeroComponent],
    }).compileComponents();
  });

  it('renders the principal match as the main hero headline', () => {
    const fixture = TestBed.createComponent(ScreenOneHeroComponent);
    fixture.componentInstance.utility = {
      live: true,
      dateLabel: 'Fri 10 Apr · 3 matches live',
      spotlight: 'Coverage · Finals Week',
    };
    fixture.componentInstance.hero = {
      title: 'Brazil vs Italy',
      subtitle: 'Final · Rio 2024',
      tag: 'Tournament Focus',
      ctaLabel: 'Watch live',
      liveLabel: 'LIVE',
      homeTeam: 'Brazil',
      awayTeam: 'Italy',
      homeScore: 2,
      awayScore: 1,
      setLabel: 'Set 4 · 24-22',
      setScores: ['S1: 25-18', 'S2: 22-25', 'S3: 25-17', 'S4: 24-22'],
    } satisfies ScreenOneHeroVm;

    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Brazil vs Italy');
    expect(root.textContent).toContain('LIVE');
    expect(root.textContent).toContain('24-22');
    expect(root.textContent).not.toContain('Read Article');
  });

  it('keeps the live scoreboard visible for the featured match', () => {
    const fixture = TestBed.createComponent(ScreenOneHeroComponent);
    fixture.componentInstance.utility = {
      live: true,
      dateLabel: 'Fri 10 Apr · 3 matches live',
      spotlight: 'Coverage · Finals Week',
    };
    fixture.componentInstance.hero = {
      title: 'Brazil vs Italy',
      subtitle: 'Final · Rio 2024',
      tag: 'Tournament Focus',
      ctaLabel: 'Watch live',
      liveLabel: 'LIVE',
      homeTeam: 'Brazil',
      awayTeam: 'Italy',
      homeScore: 2,
      awayScore: 1,
      setLabel: 'Set 4 · 24-22',
      setScores: ['S1: 25-18', 'S2: 22-25', 'S3: 25-17', 'S4: 24-22'],
    } satisfies ScreenOneHeroVm;

    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Brazil');
    expect(root.textContent).toContain('Italy');
    expect(root.textContent).toContain('Match point');
  });
});
