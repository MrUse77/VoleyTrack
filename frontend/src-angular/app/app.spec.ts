import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { routes } from './app.routes';
import { AppShellComponent } from './shell';

describe('App', () => {
  it('separates dashboard and matches routes', async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();

    const harness = await RouterTestingHarness.create();
    const dashboard = await harness.navigateByUrl('/', AppShellComponent);

    expect(dashboard).toBeInstanceOf(AppShellComponent);
    expect(harness.routeNativeElement?.textContent).toContain('VOLLEYTRACK');
    expect(harness.routeNativeElement?.textContent).not.toContain('Match Center');
    expect(harness.routeNativeElement?.textContent).toContain('Brazil vs Italy');
    expect(harness.routeNativeElement?.textContent).not.toContain('Local dashboard build');

    const matches = await harness.navigateByUrl('/matches', AppShellComponent);

    expect(matches).toBeInstanceOf(AppShellComponent);
    expect(harness.routeNativeElement?.textContent).toContain('Match Center');
    expect(harness.routeNativeElement?.textContent).toContain('Local dashboard build');
    expect(harness.routeNativeElement?.textContent).toContain('VOLLEYTRACK');
  });
});
