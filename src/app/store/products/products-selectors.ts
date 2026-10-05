import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './products-reducer';

export const selectProductsState = createFeatureSelector<ProductsState>('products');

export const selectApiItems = createSelector(selectProductsState, (s) => s?.apiItems ?? []);
export const selectLocalItems = createSelector(selectProductsState, (s) => s?.localItems ?? []);
export const selectDeletedIds = createSelector(selectProductsState, (s) => s?.deletedIds ?? []);
export const selectSearchQuery = createSelector(selectProductsState, (s) => s?.searchQuery ?? '');
export const selectSortField = createSelector(selectProductsState, (s) => s?.sortField ?? 'productName');
export const selectSortOrder = createSelector(selectProductsState, (s) => s?.sortOrder ?? 1);
export const selectProductsLoading = createSelector(selectProductsState, (s) => s?.loading ?? false);
export const selectProductsError = createSelector(selectProductsState, (s) => s?.error ?? null);

/**
 * Merges API items and local items, filters deleted ids, applies search and sort.
 * Local edits override API records by id. Local-only additions are appended.
 */
export const selectMergedProducts = createSelector(
  selectApiItems,
  selectLocalItems,
  selectDeletedIds,
  selectSearchQuery,
  selectSortField,
  selectSortOrder,
  (apiItems, localItems, deletedIds, query, sortField, sortOrder) => {
    // Build a map from API items, override with local edits
    const merged = new Map(apiItems.map((p) => [p.id, p]));
    localItems.forEach((p) => merged.set(p.id, p));

    // Filter deleted ids
    let result = Array.from(merged.values()).filter(
      (p) => !deletedIds.includes(p.id)
    );

    // Search filter (case-insensitive, across productName and url)
    if (query.trim()) {
      const lower = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.productName.toLowerCase().includes(lower) ||
          p.url.toLowerCase().includes(lower)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      const aVal = (a as any)[sortField] ?? '';
      const bVal = (b as any)[sortField] ?? '';
      return aVal.localeCompare(bVal) * sortOrder;
    });

    return result;
  }
);

export const selectTotalProducts = createSelector(
  selectMergedProducts,
  (products) => products.length
);