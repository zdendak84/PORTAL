export interface SessionDataModel {
  userName: string;
  stationHostname: string;
  stationType: number;
  ipAddress: string;
  vncPassword: string;
  terminalSrvHostname: string;
  printerNameXPS: string;
  printerNameINI: string;
  roomId: number;
  logonAt: string;
  logoffAt: string;
  active: boolean;
  lastActivity: string;
}
