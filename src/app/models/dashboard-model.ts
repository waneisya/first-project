export interface MapPin {
  id: string;
  label: string;
  lat: number;
  lng: number;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface DashboardChartData {
  gaugeValue: number; // 0-100
  lineChart: ChartPoint[];
  donutChart: ChartPoint[];
}