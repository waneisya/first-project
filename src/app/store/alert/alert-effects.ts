import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';

import { AlertService } from '../../core/services/alert-service';
import * as AlertsActions from './alert-actions';
import { AlertItem } from '../../models/alert-model';

export interface AlertResponse {
  data: AlertItem[];
  total: number;
}

@Injectable()
export class AlertsEffects {
  private actions$ = inject(Actions);
  private alertService = inject(AlertService);
  private messageService = inject(MessageService);

  loadAlerts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsActions.loadAlerts),
      switchMap(({ id, startDate, endDate, pageSize, indexNumber }) =>
        this.alertService.getAlerts({ id, startDate, endDate, pageSize, indexNumber }).pipe(
          map(({ data, total }) =>
            AlertsActions.loadAlertsSuccess({ data, total })
          ),
          catchError((err) => {
            const error =
              err.status === 401
                ? 'Session expired. Please log in again.'
                : 'Failed to load alerts. Please try again.';
            return of(AlertsActions.loadAlertsFailure({ error }));
          })
        )
      )
    )
  );

  loadAlertsFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AlertsActions.loadAlertsFailure),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
            life: 5000,
          });
        })
      ),
    { dispatch: false }
  );
}