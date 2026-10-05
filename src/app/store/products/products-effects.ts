import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, retry, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';

import { ProductService } from '../../core/services/product-service';
import * as ProductsActions from './products-actions';

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private productService = inject(ProductService);
  private messageService = inject(MessageService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      switchMap(() =>
        this.productService.getProducts().pipe(
          retry({ count: 3, delay: 1000 }),
          map((products) => ProductsActions.loadProductsSuccess({ products })),
          catchError((err) => {
            const error =
              err.status === 401
                ? 'Session expired. Please log in again.'
                : 'Failed to load products. Please try again.';
            return of(ProductsActions.loadProductsFailure({ error }));
          })
        )
      )
    )
  );

  loadProductsFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductsActions.loadProductsFailure),
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

  addProduct$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductsActions.addProduct),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Product Added',
            detail: 'New product has been added successfully.',
            life: 3000,
          });
        })
      ),
    { dispatch: false }
  );

  editProduct$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductsActions.editProduct),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Product Updated',
            detail: 'Product has been updated successfully.',
            life: 3000,
          });
        })
      ),
    { dispatch: false }
  );

  removeProduct$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductsActions.removeProduct),
        tap(() => {
          this.messageService.add({
            severity: 'info',
            summary: 'Product Removed',
            detail: 'Product has been removed.',
            life: 3000,
          });
        })
      ),
    { dispatch: false }
  );
}