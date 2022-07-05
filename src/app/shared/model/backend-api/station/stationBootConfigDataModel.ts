export interface StationBootConfigDataModel {
  stationHostname: string;
  macAddress: string;
  bootSrvHostname: string;
  imageName: string;
  customImageName: string;
  bootLoader: number;
  applicationName: string;
  applicationConfig: string;
  displayWidth: number;
  displayHeight: number;
  displayRotation: number;
  customDisplayConfig: string;
}
