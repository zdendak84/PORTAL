import {DependencyModel} from "@shared/model/backend-api/dependencyModel";

export interface PrinterDevDataModel extends DependencyModel {
  printerDevId: number;
  name: string;
  cartridge: string;
  description: string;
}
