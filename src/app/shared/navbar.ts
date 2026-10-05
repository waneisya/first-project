import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';

import * as AuthActions from '../store/auth/auth-actions';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    TooltipModule,
    AvatarModule,
    DialogModule,
  ],
})
export class NavbarComponent {
  private router = inject(Router);
  private store = inject(Store);

  logoutVisible = false;

  goTo(path: string): void {
    this.router.navigate([path]);
  }

  isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }

  confirmLogout(): void {
    this.logoutVisible = true;
  }

  onLogoutConfirm(): void {
    this.logoutVisible = false;
    this.store.dispatch(AuthActions.logout());
  }

  onLogoutCancel(): void {
    this.logoutVisible = false;
  }
}