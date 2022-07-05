import {StationBootConfigDataModel} from "@shared/model/backend-api/station/stationBootConfigDataModel";
import {StationRDConfigDataModel} from "@shared/model/backend-api/station/stationRDConfigDataModel";

export interface StationDataModel {
  hostname: string;
  description: string;
  ipAddress: string;
  vncPassword?: string;
  type: number;
  terminalSrvPoolName: string;
  terminalSrvHostname: string;
  printerNameXPS: string;
  printerNameINI: string;
  roomId: number;
  clientVersion?: string;
  notepad: string;
  active?: boolean;
  virtual: boolean;
  forceTerminalSrv: boolean;
  totalSpace?: number;
  freeSpace?: number;
  stationBootConfig?: StationBootConfigDataModel;
  stationRDConfig? : StationRDConfigDataModel;
}
