import {OperationDataModel} from "@shared/model/backend-api/operationDataModel";

export interface ListingDataModel extends OperationDataModel {
  slotId: number;
  date: string;
  type: number;
  priority: number;
  timeFrom: string;
  timeTo: string;
  duration: number;
  doctorId: number;
  examinationId: number;
  workplaceId: number;
  roomId: number;
  patientId: number;
  description: string;
  statim: boolean;
  relevant: boolean;
  firstName: string;
  lastName: string;
  insuranceNumber: number;
  insuranceId: number;
  yearOfBirth: number;
  telephone: string;
  previousOrderSlotId?: number;
  nextOrderSlotId?: number;
  operationWorkplace?: boolean;
}
