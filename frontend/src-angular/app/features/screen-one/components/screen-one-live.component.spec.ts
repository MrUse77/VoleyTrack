import { TestBed } from '@angular/core/testing';
import { ScreenOneLiveComponent } from './screen-one-live.component';
import type { ScreenOneLiveMatchVm, ScreenOneHeroVm } from '../screen-one.models';

describe('ScreenOneLiveComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenOneLiveComponent],
    }).compileComponents();
  });

  it('renders the main live hero and preview rows with a Ver más action', () => {
    const fixture = TestBed.createComponent(ScreenOneLiveComponent);
    fixture.componentInstance.hero = {
      title: 'Brazil vs Italy',
      subtitle: 'VNL 2024 · Final · Rio de Janeiro',
      tag: 'Main live match',
      ctaLabel: 'Ver transmisión',
      liveLabel: 'LIVE',
      homeTeam: 'Brazil',
      awayTeam: 'Italy',
      homeScore: 2,
      awayScore: 1,
      setLabel: 'Set 4 · 24-22',
      setScores: ['S1: 25-18', 'S2: 22-25', 'S3: 25-17', 'S4: 24-22'],
    } satisfies ScreenOneHeroVm;
    fixture.componentInstance.liveMatches = [
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
      {
        league: 'Superliga',
        teams: ['Serbia', 'Argentina'],
        score: '2 - 2',
        status: 'Set 5 · 8-9',
        stage: 'Decider',
      },
      {
        league: 'VNL',
        teams: ['Canada', 'Germany'],
        score: '1 - 0',
        status: 'Set 2 · 16-14',
        stage: 'Live',
      },
    ] satisfies ScreenOneLiveMatchVm[];

    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.textContent).toContain('Brazil vs Italy');
    expect(root.textContent).toContain('USA vs Poland');
    expect(root.textContent).toContain('France vs Japan');
    expect(root.textContent).toContain('Serbia vs Argentina');
    expect(root.textContent).toContain('Ver más');
    expect(root.textContent).not.toContain('Match Center');
  });

  it('keeps the live preview bounded to the configured number of rows', () => {
    const fixture = TestBed.createComponent(ScreenOneLiveComponent);
    fixture.componentInstance.hero = {
      title: 'Brazil vs Italy',
      subtitle: 'VNL 2024 · Final · Rio de Janeiro',
      tag: 'Main live match',
      ctaLabel: 'Ver transmisión',
      liveLabel: 'LIVE',
      homeTeam: 'Brazil',
      awayTeam: 'Italy',
      homeScore: 2,
      awayScore: 1,
      setLabel: 'Set 4 · 24-22',
      setScores: ['S1: 25-18', 'S2: 22-25', 'S3: 25-17', 'S4: 24-22'],
    } satisfies ScreenOneHeroVm;
    fixture.componentInstance.liveMatches = [
      {
        league: 'World Cup',
        teams: ['USA', 'Poland'],
        score: '1 - 1',
        status: 'Set 3 · 18-19',
        stage: 'Live',
      },
    ] satisfies ScreenOneLiveMatchVm[];

    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.textContent).toContain('USA vs Poland');
    expect(root.textContent).not.toContain('France vs Japan');
    expect(root.querySelectorAll('article').length).toBe(1);
    expect(root.textContent).toContain(
      'Preview shows the main live match plus 3 more live matches.',
    );
  });
});
