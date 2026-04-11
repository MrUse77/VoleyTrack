import { TestBed } from '@angular/core/testing';
import { ScreenOnePage } from './screen-one.page';

describe('ScreenOnePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenOnePage],
    }).compileComponents();
  });

  it('renders the dashboard shell, hero, lists, rail, and no matches footer', () => {
    const fixture = TestBed.createComponent(ScreenOnePage);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const brandIcons = root.querySelectorAll('img[alt="VOLLEYTRACK"]');

    expect(root.querySelector('header')).not.toBeNull();
    expect(root.querySelector('main')).not.toBeNull();
    expect(root.querySelector('aside')).not.toBeNull();
    expect(root.querySelector('footer')).toBeNull();
    expect(root.querySelector('app-screen-one-matches')).toBeNull();
    expect(root.textContent).toContain('VOLLEYTRACK');
    expect(root.textContent).toContain('Brazil vs Italy');
    expect(root.textContent).toContain('Finished');
    expect(root.textContent).toContain('Upcoming');
    expect(root.textContent).toContain('Trending Players');
    expect(root.textContent).not.toContain('Match Center');
    expect(root.textContent).not.toContain('Local dashboard build');
    expect(brandIcons).toHaveLength(2);
    expect(brandIcons[0]?.getAttribute('src')).toBe('/icon.svg');
    expect(brandIcons[0]?.getAttribute('width')).toBe('25');
    expect(brandIcons[0]?.getAttribute('height')).toBe('25');
    expect(root.textContent).not.toContain('Latest News');
    expect(root.textContent).not.toContain('Read Article');
  });

  it('renders the sections in the expected editorial order', () => {
    const fixture = TestBed.createComponent(ScreenOnePage);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const sections = Array.from(
      root.querySelectorAll('app-screen-one-hero, app-screen-one-matches, app-screen-one-lists'),
    );

    expect(sections.map((section) => section.tagName.toLowerCase())).toEqual([
      'app-screen-one-hero',
      'app-screen-one-lists',
    ]);
  });

  it('keeps the rail visible and stacked below the main column on smaller viewports', () => {
    const fixture = TestBed.createComponent(ScreenOnePage);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const main = root.querySelector('main');
    const aside = root.querySelector('aside');

    expect(main?.className).toContain('flex-col');
    expect(main?.className).toContain('xl:flex-row');
    expect(aside?.className).not.toContain('hidden');
    expect(aside?.className).toContain('w-full');
  });

  it('marks Dashboard as the active navigation entry on the home route', () => {
    const fixture = TestBed.createComponent(ScreenOnePage);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const active = root.querySelector('a[aria-current="page"]');

    expect(active?.textContent?.trim()).toBe('Dashboard');
  });
});
