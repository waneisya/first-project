import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { selectToken } from '../../store/auth/auth-selectors';
import * as AuthActions from '../../store/auth/auth-actions';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private store: Store) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip attaching token for the auth endpoint itself
    if (req.url.includes('/auth')) {
      return next.handle(req);
    }

    return this.store.select(selectToken).pipe(
      take(1),
      switchMap((token) => {
        const authReq = token
          ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
          : req;

        return next.handle(authReq).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              // Token is invalid or expired — force logout
              this.store.dispatch(AuthActions.logout());
            }
            return throwError(() => error);
          })
        );
      })
    );
  }
}