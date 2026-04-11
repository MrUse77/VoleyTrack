import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ShellTopbarComponent } from './components/shell-topbar.component';
import type { AppBrand, AppNavItem } from '../shared';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, ShellTopbarComponent],
  template: `
    <div class="min-h-screen bg-vt-page text-vt-text">
      <app-shell-topbar [brand]="brand" [navigation]="navigation" />
      <router-outlet />
    </div>
  `,
})
export class AppShellComponent {
  readonly brand: AppBrand = {
    title: 'VOLLEYTRACK',
    subtitle: 'Pro dashboard',
  };

  readonly navigation: AppNavItem[] = [
    { label: 'Dashboard', href: '/' },
    { label: 'Matches', href: '/matches' },
    { label: 'Results', href: '/results' },
    { label: 'Stats', href: '/stats' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Fantasy', href: '/fantasy' },
  ];
}
