import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  
  // ── Default redirect
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },

  // ── Auth (public)
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login').then((m) => m.LoginComponent),
  },

  // ── Register
  {
    path: 'register',
    loadComponent: () =>
      import('./features/register/register').then((m) => m.RegisterComponent),
  },

  // ── Protected routes
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/home/home').then((m) => m.HomeComponent),
  },
 
  {
    path: 'dashboard',                                 
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard').then((m) => m.DashboardComponent),
  },

  {
    path: 'detail/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/detail/detail').then((m) => m.DetailComponent),
  },

  // ── Wildcard fallback
  {
    path: '**',
    redirectTo: 'login',
  },
];