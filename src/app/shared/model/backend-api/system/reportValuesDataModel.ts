import { ReportDataModel } from "@shared/model/backend-api/system/reportDataModel";

export interface ReportValuesDataModel extends ReportDataModel{
  min: number;
  avg: number;
  max: number;
}
