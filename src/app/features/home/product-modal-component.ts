import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

import { Product } from '../../../app/models/product-model';

export type ModalMode = 'add' | 'edit';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule, ButtonModule, InputTextModule],
  template: `
    <p-dialog
      [(visible)]="visible"
      [header]="mode === 'add' ? 'Add Product' : 'Edit Product'"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      styleClass="!w-full !max-w-md !rounded-xl"
      (onHide)="onCancel()"
    >
      <form [formGroup]="form" class="flex flex-col gap-4 pt-2" (ngSubmit)="onSubmit()">

        <!-- Product Name -->
        <div class="flex flex-col gap-1.5">
          <label for="productName" class="text-sm font-semibold text-slate-700">
            Product Name <span class="text-red-500">*</span>
          </label>
          <input
            id="productName"
            pInputText
            formControlName="productName"
            placeholder="Enter product name"
            class="w-full"
            [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('productName') }"
          />
          <small class="text-red-500 text-xs" *ngIf="isFieldInvalid('productName')">
            Product name is required.
          </small>
        </div>

        <!-- URL -->
        <div class="flex flex-col gap-1.5">
          <label for="url" class="text-sm font-semibold text-slate-700">
            URL <span class="text-red-500">*</span>
          </label>
          <input
            id="url"
            pInputText
            formControlName="url"
            placeholder="https://example.com"
            class="w-full"
            [ngClass]="{ 'ng-invalid ng-dirty': isFieldInvalid('url') }"
          />
          <small class="text-red-500 text-xs" *ngIf="isFieldInvalid('url')">
            <ng-container *ngIf="form.get('url')?.errors?.['required']">URL is required.</ng-container>
            <ng-container *ngIf="form.get('url')?.errors?.['pattern']">Enter a valid URL.</ng-container>
          </small>
        </div>

      </form>

      <ng-template #footer>
        <div class="flex items-center justify-end gap-2 pt-2">
          <p-button
            label="Cancel"
            severity="secondary"
            [outlined]="true"
            (onClick)="onCancel()"
          />
          <!-- Hanya butang ini ditukar warna Navy -->
          <p-button
            [label]="mode === 'add' ? 'Add Product' : 'Save Changes'"
            [disabled]="form.invalid"
            styleClass="!bg-blue-950 hover:!bg-blue-900 !text-white !border-none rounded-lg px-4 py-2 font-medium"
            (onClick)="onSubmit()"
          />
        </div>
      </ng-template>
    </p-dialog>
  `,
})
export class ProductModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() mode: ModalMode = 'add';
  @Input() product: Product | null = null;

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<{ mode: ModalMode; product: Product }>();

  form!: FormGroup;

  private readonly URL_PATTERN =
    /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#\-_]*[\w@?^=%&/~+#\-_])?$/;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      productName: ['', [Validators.required]],
      url: ['', [Validators.required, Validators.pattern(this.URL_PATTERN)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] || changes['mode']) {
      if (this.mode === 'edit' && this.product) {
        this.form.patchValue({
          productName: this.product.productName,
          url: this.product.url,
        });
      } else {
        this.form.reset();
      }
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { productName, url } = this.form.value;
    const product: Product = {
      id: this.mode === 'edit' && this.product ? this.product.id : `local-${Date.now()}`,
      productName,
      url,
    };

    this.save.emit({ mode: this.mode, product });
    this.closeModal();
  }

  onCancel(): void {
    this.closeModal();
  }

  private closeModal(): void {
    this.form.reset();
    this.visible = false;
    this.visibleChange.emit(false);
  }
}