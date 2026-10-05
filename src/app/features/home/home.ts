import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from '../../shared/navbar';
import { ToastModule } from 'primeng/toast';

// PrimeNG
import { TableModule } from 'primeng/table';
import { SortIcon } from 'primeng/table';   
import { SortEvent, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

import { Product } from '../../../app/models/product-model';
import { ProductModalComponent, ModalMode } from './product-modal-component';
import * as ProductsActions from '../../store/products/products-actions';
import {
  selectMergedProducts,
  selectProductsLoading,
  selectProductsError,
} from '../../store/products/products-selectors';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    SkeletonModule,
    TooltipModule,
    ConfirmDialogModule,
    ProductModalComponent,
    NavbarComponent,
    ToastModule,
  ],
  providers: [ConfirmationService],
})
export class HomeComponent implements OnInit, OnDestroy {
  products$!: Observable<Product[]>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;

  searchControl = new FormControl('');
  skeletonRows = Array(8);

  modalVisible = false;
  modalMode: ModalMode = 'add';
  selectedProduct: Product | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.products$ = this.store.select(selectMergedProducts);
    this.loading$ = this.store.select(selectProductsLoading);
    this.error$ = this.store.select(selectProductsError);

    this.loadProducts();

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((query) => {
        // NOTE: pastikan 'setSearchQuery' memang wujud dalam products-actions.ts
        this.store.dispatch(ProductsActions.setSearchQuery({ query: query ?? '' }));
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadProducts(): void {
    this.store.dispatch(ProductsActions.loadProducts());
  }

  goToDetail(product: Product): void {
    this.router.navigate(['/detail', product.id]);
  }

  openAddModal(): void {
    this.modalMode = 'add';
    this.selectedProduct = null;
    this.modalVisible = true;
  }

  openEditModal(product: Product): void {
    this.modalMode = 'edit';
    this.selectedProduct = product;
    this.modalVisible = true;
  }

  onModalSave({ mode, product }: { mode: ModalMode; product: Product }): void {
    if (mode === 'add') {
      this.store.dispatch(ProductsActions.addProduct({ product }));
    } else {
      this.store.dispatch(ProductsActions.editProduct({ product }));
    }
  }

  confirmRemove(product: Product): void {
    this.confirmationService.confirm({
      message: `Remove <strong>${product.productName}</strong>? This cannot be undone.`,
      header: 'Remove Product',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Remove',
      rejectLabel: 'Cancel',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(ProductsActions.removeProduct({ id: product.id }));
      },
    });
  }

  onSort(event: SortEvent): void {
    if (event.field) {
      // NOTE: pastikan 'setSortField' memang wujud dalam products-actions.ts
      this.store.dispatch(
        ProductsActions.setSortField({
          field: event.field,
          order: (event.order ?? 1) as 1 | -1,
        })
      );
    }
  }
}