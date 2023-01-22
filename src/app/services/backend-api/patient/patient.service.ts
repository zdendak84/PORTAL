import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PatientDataModel } from '@shared/model/backend-api/patientDataModel';

const URL_GET_PATIENT_INS = 'api/patient/ins/{insuranceNumber}';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  constructor(private http: HttpClient) {}

  getPatientByInsuranceNumber(insuranceNumber: string): Observable<PatientDataModel> {
    return this.http.get<PatientDataModel>(URL_GET_PATIENT_INS.replace('{insuranceNumber}', insuranceNumber));
  }
}
