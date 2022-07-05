import {DependencyModel} from "@shared/model/backend-api/dependencyModel";

export interface PrinterDataModel extends DependencyModel {
  printerName: string;
  description: string;
  ipAddress: string;
  type: number;
  roomId: number;
  printerDevId: number;
}
