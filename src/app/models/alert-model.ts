export interface AlertItem {
  [key: string]: any; // shape confirmed once API is hit
}

export interface AlertQueryParams {
  id: string;
  startDate: string;   // YYYY-MM-DD
  endDate: string;     // YYYY-MM-DD
  pageSize: number;
  indexNumber: number;
}

export interface AlertResponse {
  data: AlertItem[];
  total: number;
}