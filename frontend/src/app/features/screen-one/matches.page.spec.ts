import { TestBed } from '@angular/core/testing';
import { MatchesPage } from './matches.page';

describe('MatchesPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchesPage],
    }).compileComponents();
  });

  it('renders the Match Center layout and footer on the matches route', () => {
    const fixture = TestBed.createComponent(MatchesPage);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const brandIcons = root.querySelectorAll('img[alt="VOLLEYTRACK"]');

    expect(root.querySelector('main')).not.toBeNull();
    expect(root.querySelector('footer')).not.toBeNull();
    expect(root.querySelector('app-screen-one-hero')).toBeNull();
    expect(root.querySelector('app-screen-one-lists')).toBeNull();
    expect(root.querySelector('app-screen-one-rail')).toBeNull();
    expect(root.querySelector('app-screen-one-footer')).not.toBeNull();
    expect(root.textContent).toContain('Match Center');
    expect(root.textContent).toContain('Brazil vs Italy');
    expect(root.textContent).toContain('Local dashboard build');
    expect(root.textContent).toContain('Dashboard');
    expect(root.textContent).toContain('Matches');
    expect(root.textContent).toContain('Featured match');
    expect(root.textContent).toContain('LIVE');
    expect(root.textContent).toContain('World Cup');
    expect(brandIcons).toHaveLength(2);
    expect(root.querySelector('a[aria-current="page"]')?.textContent?.trim()).toBe('Matches');
  });

  it('keeps the footer visible below the matches content', () => {
    const fixture = TestBed.createComponent(MatchesPage);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const main = root.querySelector('main');
    const footer = root.querySelector('app-screen-one-footer');

    expect(main?.nextElementSibling).toBe(footer);
  });
});
