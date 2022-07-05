export interface StationRDConfigDataModel {
  stationHostname: string;
  vnc: boolean;
  permanentlyOnline: boolean;
  inactivityTimeout: number;
  rdColorDepth: number;
  audio: boolean;
  audioConfig: string;
  serial: number;
  serialConfig: string;
  smartCard: boolean;
  smartCardConfig: string;
  video: boolean;
  videoConfig: string;
}
