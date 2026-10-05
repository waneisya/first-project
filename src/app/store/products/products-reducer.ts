import { createReducer, on } from '@ngrx/store';
import { Product } from '../../models/product-model';
import * as ProductsActions from './products-actions';

export interface ProductsState {
  apiItems: Product[];       // fetched from GET /api/productList
  localItems: Product[];     // in-memory: added or edited records
  deletedIds: string[];      // ids removed in-memory
  searchQuery: string;
  sortField: string;
  sortOrder: 1 | -1;
  loading: boolean;
  error: string | null;
}

export const initialState: ProductsState = {
  apiItems: [],
  localItems: [],
  deletedIds: [],
  searchQuery: '',
  sortField: 'productName',
  sortOrder: 1,
  loading: false,
  error: null,
};

export const productsReducer = createReducer(
  initialState,

  on(ProductsActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductsActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    apiItems: products,
    loading: false,
  })),

  on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add: generate a local id prefixed with 'local-' to distinguish from API ids
  on(ProductsActions.addProduct, (state, { product }) => ({
    ...state,
    localItems: [...state.localItems, product],
  })),

  // Edit: update in localItems if it exists there, otherwise push as a new localItem
  // (overrides the API version via the merged selector)
  on(ProductsActions.editProduct, (state, { product }) => {
    const existsLocally = state.localItems.some((p) => p.id === product.id);
    return {
      ...state,
      localItems: existsLocally
        ? state.localItems.map((p) => (p.id === product.id ? product : p))
        : [...state.localItems, product],
    };
  }),

  // Remove: add id to deletedIds so merged selector filters it out
  on(ProductsActions.removeProduct, (state, { id }) => ({
    ...state,
    deletedIds: [...state.deletedIds, id],
    localItems: state.localItems.filter((p) => p.id !== id),
  })),

  on(ProductsActions.setSearchQuery, (state, { query }) => ({
    ...state,
    searchQuery: query,
  })),

  on(ProductsActions.setSortField, (state, { field, order }) => ({
    ...state,
    sortField: field,
    sortOrder: order,
  })),
);