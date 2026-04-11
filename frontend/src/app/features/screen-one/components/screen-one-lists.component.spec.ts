import { TestBed } from '@angular/core/testing';
import { ScreenOneListsComponent } from './screen-one-lists.component';
import type { ScreenOneListSectionVm } from '../screen-one.models';

describe('ScreenOneListsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScreenOneListsComponent],
    }).compileComponents();
  });

  it('renders only the requested preview count for a section', () => {
    const fixture = TestBed.createComponent(ScreenOneListsComponent);
    fixture.componentInstance.sections = [
      {
        title: 'Upcoming',
        previewCount: 3,
        items: [
          { left: 'USA', right: 'POL', score: '14:00', meta: 'Pool A' },
          { left: 'FRA', right: 'JPN', score: '16:00', meta: 'Pool B' },
          { left: 'ARG', right: 'SLO', score: '18:00', meta: 'Pool C' },
          { left: 'CZE', right: 'CAN', score: '20:00', meta: 'Pool D' },
        ],
        emptyState: 'No upcoming matches yet',
      } satisfies ScreenOneListSectionVm,
    ];

    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const section = Array.from(root.querySelectorAll('article')).find((node) =>
      node.textContent?.includes('Upcoming'),
    ) as HTMLElement | undefined;

    expect(root.textContent).toContain('USA');
    expect(root.textContent).toContain('SLO');
    expect(root.textContent).not.toContain('CZE');
    expect(section?.querySelectorAll(':scope > div:nth-of-type(2) > div').length).toBe(3);
  });

  it('allows a denser finished preview when configured', () => {
    const fixture = TestBed.createComponent(ScreenOneListsComponent);
    fixture.componentInstance.sections = [
      {
        title: 'Finished',
        previewCount: 4,
        items: [
          { left: 'CAN', right: 'GER', score: '3 - 1', meta: 'Final' },
          { left: 'NED', right: 'IRI', score: '0 - 3', meta: 'Round 3' },
          { left: 'CUB', right: 'BUL', score: '3 - 2', meta: 'Tie-break' },
          { left: 'SRB', right: 'FRA', score: '1 - 3', meta: 'Quarterfinal' },
          { left: 'USA', right: 'BRA', score: '2 - 3', meta: 'Semifinal' },
        ],
        emptyState: 'No results yet',
      } satisfies ScreenOneListSectionVm,
    ];

    fixture.detectChanges();

    const root = fixture.nativeElement as HTMLElement;
    const section = Array.from(root.querySelectorAll('article')).find((node) =>
      node.textContent?.includes('Finished'),
    ) as HTMLElement | undefined;

    expect(root.textContent).toContain('SRB');
    expect(root.textContent).not.toContain('USA');
    expect(section?.querySelectorAll(':scope > div:nth-of-type(2) > div').length).toBe(4);
  });
});
