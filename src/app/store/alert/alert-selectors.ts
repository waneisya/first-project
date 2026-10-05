import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AlertsState } from './alert-reducers';

export const selectAlertsState = createFeatureSelector<AlertsState>('alerts');

export const selectAlertsData = createSelector(selectAlertsState, (s) => s?.data ?? []);
export const selectAlertsTotal = createSelector(selectAlertsState, (s) => s?.total ?? 0);
export const selectAlertsLoading = createSelector(selectAlertsState, (s) => s?.loading ?? false);
export const selectAlertsError = createSelector(selectAlertsState, (s) => s?.error ?? null);
export const selectAlertsIndexNumber = createSelector(selectAlertsState, (s) => s?.indexNumber ?? 1);
export const selectAlertsPageSize = createSelector(selectAlertsState, (s) => s?.pageSize ?? 10);
export const selectAlertsStartDate = createSelector(selectAlertsState, (s) => s?.startDate ?? '');
export const selectAlertsEndDate = createSelector(selectAlertsState, (s) => s?.endDate ?? '');

/** Total number of pages derived from total and pageSize. */
export const selectTotalPages = createSelector(
  selectAlertsTotal,
  selectAlertsPageSize,
  (total, pageSize) => Math.ceil(total / pageSize)
);