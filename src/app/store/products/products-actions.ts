import { createAction, props } from '@ngrx/store';
import { Product } from '../../models/product-model';

// ── Load ──────────────────────────────────────────────────────────────────────
export const loadProducts = createAction('[Products] Load Products');

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ products: Product[] }>()
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>()
);

// ── In-memory CRUD ────────────────────────────────────────────────────────────
export const addProduct = createAction(
  '[Products] Add Product',
  props<{ product: Product }>()
);

export const editProduct = createAction(
  '[Products] Edit Product',
  props<{ product: Product }>()
);

export const removeProduct = createAction(
  '[Products] Remove Product',
  props<{ id: string }>()
);

// ── Search / Sort ─────────────────────────────────────────────────────────────
export const setSearchQuery = createAction(
  '[Products] Set Search Query',
  props<{ query: string }>()
);

export const setSortField = createAction(
  '[Products] Set Sort Field',
  props<{ field: string; order: 1 | -1 }>()
);