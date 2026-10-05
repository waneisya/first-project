import { createReducer, on } from '@ngrx/store';
import { AlertItem } from '../../models/alert-model';
import * as AlertsActions from './alert-actions';

export interface AlertsState {
  data: AlertItem[];
  total: number;
  indexNumber: number;
  pageSize: number;
  startDate: string;
  endDate: string;
  loading: boolean;
  error: string | null;
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export const initialState: AlertsState = {
  data: [],
  total: 0,
  indexNumber: 1,
  pageSize: 10,
  startDate: getYesterday(),
  endDate: getToday(),
  loading: false,
  error: null,
};

export const alertsReducer = createReducer(
  initialState,

  on(AlertsActions.loadAlerts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AlertsActions.loadAlertsSuccess, (state, { data, total }) => ({
    ...state,
    data,
    total,
    loading: false,
  })),

  on(AlertsActions.loadAlertsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AlertsActions.setDateRange, (state, { startDate, endDate }) => ({
    ...state,
    startDate,
    endDate,
    indexNumber: 1, // reset to page 1 on date change
  })),

  on(AlertsActions.setPage, (state, { indexNumber }) => ({
    ...state,
    indexNumber,
  })),

  on(AlertsActions.resetAlerts, () => ({ ...initialState }))
);