import { EventFilterDataModel } from "@shared/model/backend-api/system/eventFilterDataModel";

export interface EventDataModel extends EventFilterDataModel{
  eventName: string;
  severity: number;
  createdAt: string;
  description: string;
}
