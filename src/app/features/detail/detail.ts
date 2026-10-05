import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';

import { AlertItem } from '../../models/alert-model';
import * as AlertsActions from '../../store/alert/alert-actions';
import {
  selectAlertsData,
  selectAlertsTotal,
  selectAlertsLoading,
  selectAlertsError,
  selectAlertsIndexNumber,
  selectAlertsPageSize,
  selectAlertsStartDate,
  selectAlertsEndDate,
} from '../../store/alert/alert-selectors';

@Component({
  selector: 'app-detail',
  standalone: true,
  templateUrl: './detail.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DatePicker,
    SkeletonModule,
    MessageModule,
    TooltipModule,
  ],
})
export class DetailComponent implements OnInit, OnDestroy {
  productId!: string;
  dateForm!: FormGroup;

  alerts$!: Observable<AlertItem[]>;
  total$!: Observable<number>;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  pageSize$!: Observable<number>;
  indexNumber$!: Observable<number>;

  currentStartDate = '';
  currentEndDate = '';
  currentPageSize = 10;

  skeletonRows = Array(10);

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') ?? '';

    this.alerts$ = this.store.select(selectAlertsData);
    this.total$ = this.store.select(selectAlertsTotal);
    this.loading$ = this.store.select(selectAlertsLoading);
    this.error$ = this.store.select(selectAlertsError);
    this.pageSize$ = this.store.select(selectAlertsPageSize);
    this.indexNumber$ = this.store.select(selectAlertsIndexNumber);

    const yesterday = this.getYesterday();
    const today = this.getToday();

    this.dateForm = this.fb.group(
      {
        startDate: [new Date(yesterday), [Validators.required]],
        endDate: [new Date(today), [Validators.required]],
      },
      { validators: this.dateRangeValidator },
    );

    this.store
      .select(selectAlertsStartDate)
      .pipe(takeUntil(this.destroy$))
      .subscribe((d) => (this.currentStartDate = d));
    this.store
      .select(selectAlertsEndDate)
      .pipe(takeUntil(this.destroy$))
      .subscribe((d) => (this.currentEndDate = d));
    this.store
      .select(selectAlertsPageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe((s) => (this.currentPageSize = s));

    // Initial load — use yesterday/today directly, not store snapshot
    this.dispatchLoad(1, yesterday, today);
  }

  ngOnDestroy(): void {
    this.store.dispatch(AlertsActions.resetAlerts());
    this.destroy$.next();
    this.destroy$.complete();
  }

  dateRangeValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;
    if (start && end && new Date(start) > new Date(end)) {
      return { startAfterEnd: true };
    }
    return null;
  }

  onApplyFilter(): void {
     console.log('🔵 onApplyFilter called', this.dateForm.value, 'valid:', this.dateForm.valid);
    if (this.dateForm.invalid) {
      this.dateForm.markAllAsTouched();
      return;
    }

    const startDate = this.formatDate(this.dateForm.value.startDate);
    const endDate = this.formatDate(this.dateForm.value.endDate);

    console.log('🟢 dispatching load', startDate, endDate);


    this.store.dispatch(AlertsActions.setDateRange({ startDate, endDate }));
    this.dispatchLoad(1, startDate, endDate);
  }

  onPageChange(event: { first: number; rows: number }): void {
    const indexNumber = Math.floor(event.first / event.rows) + 1;
    this.store.dispatch(AlertsActions.setPage({ indexNumber }));
    this.dispatchLoad(indexNumber);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  getColumns(data: AlertItem[]): string[] {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }

  private dispatchLoad(indexNumber: number, startDate?: string, endDate?: string): void {
    this.store.dispatch(
      AlertsActions.loadAlerts({
        id: this.productId,
        startDate: startDate ?? (this.currentStartDate || this.getYesterday()),
        endDate: endDate ?? (this.currentEndDate || this.getToday()),
        pageSize: this.currentPageSize,
        indexNumber,
      }),
    );
  }

  private formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

private getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return this.formatDate(d);
}

private getToday(): string {
  return this.formatDate(new Date());
}
}