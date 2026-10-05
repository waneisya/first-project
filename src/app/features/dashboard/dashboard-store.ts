import { Injectable, signal, computed } from '@angular/core';
import { DashboardChartData, MapPin } from '../../models/dashboard-model';

@Injectable()
export class DashboardStore {

  private readonly pins = signal<MapPin[]>([]);
  private readonly search = signal('');
  private readonly chart = signal<DashboardChartData>({
    gaugeValue: 0,
    lineChart: [],
    donutChart: [],
  });

  readonly searchQuery = this.search.asReadonly();
  readonly chartData = this.chart.asReadonly();

  readonly filteredPins = computed(() => {
    const q = this.search().toLowerCase();
    return this.pins().filter(p =>
      p.label.toLowerCase().includes(q)
    );
  });

  readonly gaugeValue = computed(() => this.chart().gaugeValue);
  readonly lineChart = computed(() => this.chart().lineChart);
  readonly donutChart = computed(() => this.chart().donutChart);

  init(): void {
    this.pins.set([
      { id: '1', label: 'Kuala Lumpur HQ', lat: 3.139, lng: 101.6869 },
      { id: '2', label: 'Penang Site', lat: 5.4141, lng: 100.3288 },
      { id: '3', label: 'Johor Site', lat: 1.4927, lng: 103.7414 },
    ]);

    this.chart.set({
      gaugeValue: 72,
      lineChart: [
        { label: 'Mon', value: 12 },
        { label: 'Tue', value: 19 },
        { label: 'Wed', value: 8 },
      ],
      donutChart: [
        { label: 'Active', value: 65 },
        { label: 'Idle', value: 25 },
        { label: 'Offline', value: 10 },
      ],
    });
  }

  setSearch(value: string) {
    this.search.set(value);
  }

  addPin(pin: MapPin) {
    this.pins.update(p => [...p, pin]);
  }
}