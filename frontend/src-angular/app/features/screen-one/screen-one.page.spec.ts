import { TestBed } from '@angular/core/testing';
import { ScreenOnePage } from './screen-one.page';

describe('ScreenOnePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenOnePage],
    }).compileComponents();
  });

  it('renders the dashboard shell, hero, live preview, rail, and no matches footer', () => {
    const fixture = TestBed.createComponent(ScreenOnePage);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('main')).not.toBeNull();
    expect(root.querySelector('aside')).not.toBeNull();
    expect(root.textContent).toContain('Brazil vs Italy');
    expect(root.textContent).toContain('Live matches');
    expect(root.textContent).toContain('USA vs Poland');
    expect(root.textContent).toContain('France vs Japan');
    expect(root.textContent).toContain('Ver más');
    expect(root.textContent).toContain('Trending Players');
    expect(root.textContent).not.toContain('Match Center');
    expect(root.textContent).not.toContain('Finished');
    expect(root.textContent).not.toContain('Upcoming');
    expect(root.textContent).not.toContain('Latest News');
    expect(root.textContent).not.toContain('Read Article');
  });

  it('renders the live preview before the right rail', () => {
    const fixture = TestBed.createComponent(ScreenOnePage);
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const sections = Array.from(root.querySelectorAll('app-screen-one-live, app-screen-one-rail'));

    expect(sections.map((section) => section.tagName.toLowerCase())).toEqual([
      'app-screen-one-live',
      'app-screen-one-rail',
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

  it('keeps the dashboard surface free of the matches footer', () => {
    const fixture = TestBed.createComponent(ScreenOnePage);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Local dashboard build');
  });
});
