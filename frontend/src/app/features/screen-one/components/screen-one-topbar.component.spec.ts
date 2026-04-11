import { TestBed } from '@angular/core/testing';
import { ScreenOneTopbarComponent } from './screen-one-topbar.component';

describe('ScreenOneTopbarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenOneTopbarComponent],
    }).compileComponents();
  });

  it('renders the compact HLTV-style shell with Dashboard active', () => {
    const fixture = TestBed.createComponent(ScreenOneTopbarComponent);
    fixture.componentInstance.brand = { title: 'VOLLEYTRACK', subtitle: 'Pro dashboard' };
    fixture.componentInstance.navigation = [
      { label: 'Dashboard', href: '/', active: true },
      { label: 'Matches', href: '/matches' },
      { label: 'Results', href: '/results' },
      { label: 'Stats', href: '/stats' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Fantasy', href: '/fantasy' },
    ];
    fixture.componentInstance.utility = { live: true, dateLabel: 'Today', spotlight: '3 Matches' };
    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const links = Array.from(root.querySelectorAll('a')).map((link) => link.textContent?.trim());
    const activeLink = root.querySelector('a[aria-current="page"]');
    const brandIcon = root.querySelector('img[alt="VOLLEYTRACK"]');
    const inputs = root.querySelectorAll('input');
    const liveNowStrip = root.textContent?.includes('LIVE NOW') ?? false;
    const actionButtons = root.querySelectorAll('button[aria-label]');

    expect(root.querySelector('header')).not.toBeNull();
    expect(root.textContent).toContain('VOLLEYTRACK');
    expect(root.textContent).toContain('AV');
    expect(activeLink?.textContent?.trim()).toBe('Dashboard');
    expect(brandIcon?.getAttribute('src')).toBe('/icon.svg');
    expect(brandIcon?.getAttribute('width')).toBe('25');
    expect(brandIcon?.getAttribute('height')).toBe('25');
    expect(inputs).toHaveLength(0);
    expect(liveNowStrip).toBe(false);
    expect(actionButtons).toHaveLength(2);
    expect(links).toEqual(['Dashboard', 'Matches', 'Results', 'Stats', 'Gallery', 'Fantasy']);
  });
});
