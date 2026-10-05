import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth-reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectToken = createSelector(
  selectAuthState,
  (state) => state.token
);

export const selectTokenExpiry = createSelector(
  selectAuthState,
  (state) => state.tokenExpiry
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

// API returns expiry in MY time (GMT+0800) without timezone info.
// Append +08:00 so JS Date parses it correctly against UTC.
function parseMyTime(tokenExpiry: string): Date {
  const normalized = tokenExpiry.replace(' ', 'T') + 'Z';
  return new Date(normalized);
}

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => {
    if (!state.token || !state.tokenExpiry) return false;
    const expiry = parseMyTime(state.tokenExpiry);
    if (isNaN(expiry.getTime())) return false;
    return expiry > new Date();
  }
);