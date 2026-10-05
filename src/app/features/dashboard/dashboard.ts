import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { DialogModule } from 'primeng/dialog';
import type { ChartOptions } from 'chart.js';
import { NavbarComponent } from '../../shared/navbar';
import { MapComponent } from '../../shared/map/map';

import { DashboardStore } from './dashboard-store';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    ChartModule,
    DialogModule,
    NavbarComponent,
    MapComponent,
  ],
  providers: [DashboardStore],
})
export class DashboardComponent implements OnInit {

  store = inject(DashboardStore);

  // Add pin dialog
  pinDialogVisible = false;
  pinLabel = '';
  pinLat: number | null = null;
  pinLng: number | null = null;

  // ── Chart options (typed explicitly so Chart.js accepts per-type
  //    properties like 'cutout', which only exist on doughnut/pie charts)
  gaugeChartOptions: ChartOptions<'doughnut'> = {
    cutout: '72%',
    plugins: { legend: { display: false } },
    animation: false,
    responsive: true,
    maintainAspectRatio: false,
  };

  lineChartOptions: ChartOptions<'line'> = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { font: { size: 10 } }, grid: { color: '#f1f5f9' } },
      x: { ticks: { font: { size: 10 } }, grid: { display: false } },
    },
  };

  donutChartOptions: ChartOptions<'doughnut'> = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: { legend: { display: false } },
  };

  ngOnInit(): void {
    this.store.init();
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.store.setSearch(value);
  }

  openAddPinDialog(): void {
    this.pinLabel = '';
    this.pinLat = null;
    this.pinLng = null;
    this.pinDialogVisible = true;
  }

  onAddPinConfirm(): void {
    if (!this.pinLabel.trim()) return;
    this.store.addPin({
      id: crypto.randomUUID(),
      label: this.pinLabel.trim(),
      lat: this.pinLat ?? (3.1 + Math.random()),
      lng: this.pinLng ?? (101.6 + Math.random()),
    });
    this.pinDialogVisible = false;
  }

  onAddPinCancel(): void {
    this.pinDialogVisible = false;
  }

  gaugeChart(value: number) {
    const clamped = Math.min(100, Math.max(0, value));
    return {
      labels: ['Load', 'Available'],
      datasets: [{
        data: [clamped, 100 - clamped],
        backgroundColor: ['#3B82F6', '#E2E8F0'],
        hoverBackgroundColor: ['#2563EB', '#CBD5E1'],
        borderWidth: 0,
      }],
    };
  }

  lineChart(data: { label: string; value: number }[]) {
    return {
      labels: data?.map((d) => d.label) ?? [],
      datasets: [{
        label: 'Activity',
        data: data?.map((d) => d.value) ?? [],
        fill: true,
        tension: 0.4,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59,130,246,0.1)',
        pointBackgroundColor: '#3B82F6',
        pointRadius: 3,
      }],
    };
  }

  donutChart(data: { label: string; value: number }[]) {
    return {
      labels: data?.map((d) => d.label) ?? [],
      datasets: [{
        data: data?.map((d) => d.value) ?? [],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
        hoverBackgroundColor: ['#2563EB', '#059669', '#D97706', '#DC2626', '#7C3AED'],
        borderWidth: 0,
      }],
    };
  }
}