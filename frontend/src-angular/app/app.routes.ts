import { Routes } from '@angular/router';
import { AppShellComponent } from './shell';

export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard').then((m) => m.DashboardPage),
        pathMatch: 'full',
      },
      {
        path: 'matches',
        loadComponent: () => import('./features/matches').then((m) => m.MatchesPage),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
