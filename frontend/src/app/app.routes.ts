import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/screen-one/screen-one.page').then((m) => m.ScreenOnePage),
    pathMatch: 'full',
  },
  {
    path: 'matches',
    loadComponent: () => import('./features/screen-one/matches.page').then((m) => m.MatchesPage),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
