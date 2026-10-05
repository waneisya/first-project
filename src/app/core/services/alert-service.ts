import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AlertQueryParams } from '../../models/alert-model';
import { AlertResponse } from '../../models/alert-model';

@Injectable({ providedIn: 'root' })
export class AlertService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Fetches a paginated alert list for a given product id.
   * JWT is attached automatically by JwtInterceptor.
   */
  getAlerts(params: AlertQueryParams): Observable<AlertResponse> {
    const httpParams = new HttpParams()
      .set('startDate', params.startDate)
      .set('endDate', params.endDate)
      .set('pageSize', params.pageSize.toString())
      .set('indexNumber', params.indexNumber.toString());

    return this.http.get<AlertResponse>(
      `${this.baseUrl}/alert/list/${params.id}`,
      { params: httpParams }
    );
  }
}