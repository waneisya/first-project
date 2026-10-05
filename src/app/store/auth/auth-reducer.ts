import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth-actions';

export interface AuthState {
  token: string | null;
  tokenExpiry: string | null;
  loading: boolean;
  error: string | null;
}

const STORAGE_KEY = 'tmrnd_auth';

// API returns MY time (GMT+0800) without offset — append it for correct UTC parsing
function parseMyTime(tokenExpiry: string): Date {
  const normalized = tokenExpiry.replace(' ', 'T') + 'Z';
  return new Date(normalized);
}

function isExpired(tokenExpiry: string): boolean {
  const expiry = parseMyTime(tokenExpiry);
  if (isNaN(expiry.getTime())) return true;
  return expiry <= new Date();
}

function loadFromStorage(): Partial<AuthState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as { token: string; tokenExpiry: string };
    if (parsed.tokenExpiry && !isExpired(parsed.tokenExpiry)) {
      return { token: parsed.token, tokenExpiry: parsed.tokenExpiry };
    }
    localStorage.removeItem(STORAGE_KEY);
    return {};
  } catch {
    return {};
  }
}

export const initialState: AuthState = {
  token: null,
  tokenExpiry: null,
  loading: false,
  error: null,
  ...loadFromStorage(),
};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { token, tokenExpiry }) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, tokenExpiry }));
    return { ...state, token, tokenExpiry, loading: false, error: null };
  }),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(AuthActions.logout, () => {
    localStorage.removeItem(STORAGE_KEY);
    return { token: null, tokenExpiry: null, loading: false, error: null };
  }),


);