import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';

import { AuthService } from '../../core/services/auth-service';
import * as AuthActions from './auth-actions';

@Injectable()
export class AuthEffects {

  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  // Step 1: Call API → dispatch loginSuccess or loginFailure
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ username, password }) =>
        this.authService.login({ username, password }).pipe(
          map((res) => {
            if (!res.success || !res.token) {
              return AuthActions.loginFailure({ error: 'Invalid credentials.' });
            }
            return AuthActions.loginSuccess({
              token: res.token,
              tokenExpiry: res.tokenExpiry,
            });
          }),
          catchError((err) => {
            const error =
              err.status === 401
                ? 'Invalid credentials.'
                : err.status === 0
                  ? 'Network error. Please check your connection.'
                  : 'Login failed. Please try again.';
            return of(AuthActions.loginFailure({ error }));
          })
        )
      )
    )
  );

  // Step 2: On success → toast + navigate
  // setTimeout(0) gives the store one tick to commit the token
  // before AuthGuard reads selectIsAuthenticated
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Welcome',
            detail: 'Logged in successfully.',
            life: 3000,
          });
          setTimeout(() => this.router.navigate(['/home']), 0);
        })
      ),
    { dispatch: false }
  );

  // Step 3: On failure → toast with error
  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: error,
            life: 5000,
          });
        })
      ),
    { dispatch: false }
  );

  // Logout → toast + navigate to login
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.messageService.add({
            severity: 'info',
            summary: 'Logged out',
            detail: 'Your session has ended.',
            life: 3000,
          });
          this.router.navigate(['/login']);
        })
      ),
    { dispatch: false }
  );
}