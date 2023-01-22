import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { CodebooksDataModel } from "@shared/model/backend-api/codebooks/codebooksDataModel";
import { ExaminationDataModel } from "@shared/model/backend-api/examinationDataModel";
import { LocationDataModel } from '@shared/model/backend-api/locationDataModel';
import { WorkplaceDataModel } from '@shared/model/backend-api/workplaceDataModel';

const URL_GET_CODEBOOKS = 'api/codebooks';
const URL_GET_EXAMINATIONS = 'api/cb-examinations';
const URL_GET_LOCATIONS = 'api/cb-locations';
const URL_GET_WORKPLACES = 'api/cb-workplaces';

@Injectable({
  providedIn: 'root'
})
export class CodebookService {
  constructor(private http: HttpClient) {}

  getCodeBooks(): Observable<CodebooksDataModel> {
    return this.http.get<CodebooksDataModel>(URL_GET_CODEBOOKS);
  }

  getExaminations(): Observable<ExaminationDataModel[]> {
    return this.http.get<ExaminationDataModel[]>(URL_GET_EXAMINATIONS);
  }

  getLocations(): Observable<LocationDataModel[]> {
    return this.http.get<LocationDataModel[]>(URL_GET_LOCATIONS);
  }

  getWorkplaces(): Observable<WorkplaceDataModel[]> {
    return this.http.get<WorkplaceDataModel[]>(URL_GET_WORKPLACES);
  }
}
