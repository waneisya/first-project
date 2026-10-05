import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectToken, selectTokenExpiry } from '../../store/auth/auth-selectors';
import { combineLatest } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private store: Store, private router: Router) {}

  canActivate() {
    return combineLatest([
      this.store.select(selectToken),
      this.store.select(selectTokenExpiry),
    ]).pipe(
      take(1),
      map(([token, tokenExpiry]) => {
        if (!token) {
          return this.router.createUrlTree(['/login']);
        }

        if (!tokenExpiry) {
          return true;
        }

        const normalized = tokenExpiry.replace(' ', 'T') + 'Z';
        const expiry = new Date(normalized);

        if (isNaN(expiry.getTime()) || expiry <= new Date()) {
          return this.router.createUrlTree(['/login']);
        }

        return true;
      })
    );
  }
}