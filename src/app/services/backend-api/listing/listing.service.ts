import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ListingDataModel } from '@shared/model/backend-api/listingDataModel';
import { ListingFilterModel } from "@shared/model/filters/listingFilterModel";
import { PlanDateDataModel } from "@shared/model/backend-api/planDateDateModel";

const URL_POST_LISTING_BY_FILTER = 'api/listing';
const URL_POST_GET_PLAN_DATE = 'api/plan-date';

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  constructor(private http: HttpClient) {}

  getListingByFilter(filter: ListingFilterModel): Observable<ListingDataModel[]> {
    const postFilter = {...filter,
      dateFrom: filter.dateFrom ? filter.dateFrom.format('YYYY-MM-DD').toString() : null,
      dateTo: filter.dateTo ? filter.dateTo.format('YYYY-MM-DD').toString() : null}
    return this.http.post<ListingDataModel[]>(URL_POST_LISTING_BY_FILTER, postFilter);
  }

  getPlanDate(filter: ListingFilterModel): Observable<PlanDateDataModel> {
    const postFilter = {...filter,
      dateFrom: filter.dateFrom ? filter.dateFrom.format('YYYY-MM-DD').toString() : null }
    return this.http.post<PlanDateDataModel>(URL_POST_GET_PLAN_DATE, postFilter);
  }
}
