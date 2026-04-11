import { TestBed } from '@angular/core/testing';
import { MatchesPage } from './matches.page';

describe('MatchesPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatchesPage],
    }).compileComponents();
  });

  it('renders the Match Center category browser and footer on the matches route', () => {
    const fixture = TestBed.createComponent(MatchesPage);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const filterButtons = Array.from(root.querySelectorAll('button')).map((button) =>
      button.textContent?.trim(),
    );

    expect(root.querySelector('main')).not.toBeNull();
    expect(root.querySelector('footer')).not.toBeNull();
    expect(root.querySelector('app-shell-footer')).not.toBeNull();
    expect(root.textContent).toContain('ALL');
    expect(root.textContent).toContain('LIVE');
    expect(root.textContent).toContain('UPCOMING');
    expect(root.textContent).toContain('RESULTS');
    expect(root.textContent).toContain('Match Center');
    expect(root.textContent).toContain('Local dashboard build');
    expect(root.textContent).toContain('World Cup');
    expect(filterButtons).toContain('ALL');
    expect(filterButtons).toContain('LIVE');
    expect(filterButtons).toContain('UPCOMING');
    expect(filterButtons).toContain('RESULTS');
  });

  it('keeps the footer visible below the matches content', () => {
    const fixture = TestBed.createComponent(MatchesPage);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const main = root.querySelector('main');
    const footer = root.querySelector('app-shell-footer');

    expect(main?.nextElementSibling).toBe(footer);
  });
});
