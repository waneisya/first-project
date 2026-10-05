import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';
import { productsReducer } from './store/products/products-reducer';
import { ProductsEffects } from './store/products/products-effects';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';
import { authReducer } from './store/auth/auth-reducer';
import { AuthEffects } from './store/auth/auth-effects';
import { JwtInterceptor } from './core/interceptors/Jwt.interceptor';

// TODO: confirm this export name matches exactly what alert-reducer.ts exports
// (open alert-reducer.ts, look for "export const XXXXX = createReducer(...)")
import { alertsReducer } from './store/alert/alert-reducers';
import { AlertsEffects } from './store/alert/alert-effects';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),

    // NgRx
    provideStore({
      auth: authReducer,
      products: productsReducer,
      alerts: alertsReducer,
    }),
    provideEffects(AuthEffects, ProductsEffects, AlertsEffects),

    // HTTP
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },

    // PrimeNG — MessageService must be global so effects can inject it
    MessageService,
    providePrimeNG({ theme: { preset: Aura } }),
  ],
};