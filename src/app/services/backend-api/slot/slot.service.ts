import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OperationDataModel } from "@shared/model/backend-api/operationDataModel";
import { PatientDataModel } from "@shared/model/backend-api/patientDataModel";
import { ReorderAlternativeDataModel } from "@shared/model/backend-api/reorderAlternativeDataModel";
import { ResultDataModel } from '@shared/model/backend-api/resultDataModel';
import { SlotHistoryDataModel } from '@shared/model/backend-api/slotHistoryDataModel';

const URL_GET_SLOT_HISTORY = 'api/slot-history/{slotId}/{patientId}';
const URL_GET_SLOT_ALTERNATIVES = 'api/slot-reorder/{slotId}';
const URL_POST_SLOT_ACTION = 'api/slot-action';

@Injectable({
  providedIn: 'root'
})
export class SlotService {
  constructor(private http: HttpClient) {}

  cancelOrder(slotId: number): Observable<ResultDataModel> {
    const slotAction = {slotId: slotId, action: 'cancel'}
    return this.http.post<ResultDataModel>(URL_POST_SLOT_ACTION, slotAction);
  }

  updateOrderDescription(slotId: number, description: string): Observable<ResultDataModel> {
    const slotAction = {slotId: slotId, description: description, action: 'description'}
    return this.http.post<ResultDataModel>(URL_POST_SLOT_ACTION, slotAction);
  }

  getSlotHistoryById(slotId: number, patientId: number): Observable<SlotHistoryDataModel[]> {
    return this.http.get<SlotHistoryDataModel[]>(URL_GET_SLOT_HISTORY
      .replace('{slotId}', slotId.toString())
      .replace('{patientId}', patientId.toString()));
  }

  getReorderAlternatives(slotId: number): Observable<ReorderAlternativeDataModel[]> {
    return this.http.get<ReorderAlternativeDataModel[]>(URL_GET_SLOT_ALTERNATIVES
        .replace('{slotId}', slotId.toString()));
  }

  reserveOperation(slotId: number, patient: PatientDataModel, operation: OperationDataModel, description: String): Observable<ResultDataModel> {
    const slotAction = {slotId: slotId, patient: patient, operation: operation, action: 'reserveOperation', description: description}
    return this.http.post<ResultDataModel>(URL_POST_SLOT_ACTION, slotAction);
  }

  updateOperation(slotId: number, patient: PatientDataModel, operation: OperationDataModel, description: String): Observable<ResultDataModel> {
    const slotAction = {slotId: slotId, patient: patient, operation: operation, action: 'updateOperation', description: description}
    return this.http.post<ResultDataModel>(URL_POST_SLOT_ACTION, slotAction);
  }

  swapOrders(firstSlotId: number, secondSlotId: number): Observable<ResultDataModel> {
    const slotAction = {slotId: firstSlotId, nextSlotId: secondSlotId, action: 'swap'}
    return this.http.post<ResultDataModel>(URL_POST_SLOT_ACTION, slotAction);
  }

  slotReOrder(firstSlotId: number, secondSlotId: number): Observable<ResultDataModel> {
    const slotAction = {slotId: firstSlotId, nextSlotId: secondSlotId, action: 'reorder'}
    return this.http.post<ResultDataModel>(URL_POST_SLOT_ACTION, slotAction);
  }
}
