import { createAction, props } from '@ngrx/store';
import { AlertItem } from '../../models/alert-model';

export const loadAlerts = createAction(
  '[Alerts] Load Alerts',
  props<{
    id: string;
    startDate: string;
    endDate: string;
    pageSize: number;
    indexNumber: number;
  }>()
);

export const loadAlertsSuccess = createAction(
  '[Alerts] Load Alerts Success',
  props<{ data: AlertItem[]; total: number }>()
);

export const loadAlertsFailure = createAction(
  '[Alerts] Load Alerts Failure',
  props<{ error: string }>()
);

export const setDateRange = createAction(
  '[Alerts] Set Date Range',
  props<{ startDate: string; endDate: string }>()
);

export const setPage = createAction(
  '[Alerts] Set Page',
  props<{ indexNumber: number }>()
);

export const resetAlerts = createAction('[Alerts] Reset');