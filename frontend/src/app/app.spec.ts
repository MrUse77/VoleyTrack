import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { routes } from './app.routes';
import { ScreenOnePage } from './features/screen-one/screen-one.page';
import { MatchesPage } from './features/screen-one/matches.page';

describe('App', () => {
  it('separates dashboard and matches routes', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();

    const harness = await RouterTestingHarness.create();
    const dashboard = await harness.navigateByUrl('/', ScreenOnePage);

    expect(dashboard).toBeInstanceOf(ScreenOnePage);
    expect(harness.routeNativeElement?.textContent).toContain('VOLLEYTRACK');
    expect(harness.routeNativeElement?.textContent).not.toContain('Match Center');

    const matches = await harness.navigateByUrl('/matches', MatchesPage);

    expect(matches).toBeInstanceOf(MatchesPage);
    expect(harness.routeNativeElement?.textContent).toContain('Match Center');
    expect(harness.routeNativeElement?.textContent).toContain('Local dashboard build');
  });
});
