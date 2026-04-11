import { TestBed } from '@angular/core/testing';
import { ScreenOneFooterComponent } from './screen-one-footer.component';
import type { ScreenOneFooterVm } from '../screen-one.models';

describe('ScreenOneFooterComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenOneFooterComponent],
    }).compileComponents();
  });

  it('renders the footer brand, navigation columns, and legal line', () => {
    const fixture = TestBed.createComponent(ScreenOneFooterComponent);
    fixture.componentInstance.footer = {
      brand: {
        title: 'VOLLEYTRACK',
        subtitle: 'Pro dashboard',
      },
      columns: [
        {
          title: 'Competition',
          links: [
            { label: 'Matches', href: '#' },
            { label: 'Results', href: '#' },
          ],
        },
        {
          title: 'Community',
          links: [
            { label: 'Players', href: '#' },
            { label: 'Teams', href: '#' },
          ],
        },
        {
          title: 'Follow',
          links: [{ label: 'Instagram', href: '#' }],
        },
      ],
      legal: '© 2026 VolleyTrack. Local dashboard build.',
    } satisfies ScreenOneFooterVm;

    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.textContent).toContain('VOLLEYTRACK');
    expect(root.textContent).toContain('Competition');
    expect(root.textContent).toContain('Community');
    expect(root.textContent).toContain('Follow');
    expect(root.textContent).toContain('© 2026 VolleyTrack. Local dashboard build.');
    expect(root.querySelectorAll('a')).toHaveLength(5);
  });

  it('supports a smaller footer with fewer link columns', () => {
    const fixture = TestBed.createComponent(ScreenOneFooterComponent);
    fixture.componentInstance.footer = {
      brand: {
        title: 'VOLLEYTRACK',
        subtitle: 'Pro dashboard',
      },
      columns: [
        {
          title: 'Competition',
          links: [{ label: 'Matches', href: '#' }],
        },
        {
          title: 'Support',
          links: [{ label: 'Help', href: '#' }],
        },
      ],
      legal: '© 2026 VolleyTrack. Local dashboard build.',
    } satisfies ScreenOneFooterVm;

    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;

    expect(root.textContent).toContain('Competition');
    expect(root.textContent).toContain('Support');
    expect(root.querySelectorAll('a')).toHaveLength(2);
  });
});
