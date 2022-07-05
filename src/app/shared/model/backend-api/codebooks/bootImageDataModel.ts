export interface BootImageDataModel {
  imageName: string;
  description: string;
  type: number;
  custom: boolean;
  rdpDefaults: string;
  rdpAudio: string;
  rdpVideo: string;
  rdpSerial: string;
  rdpSmartcard: string;
  pathHostname: string;
  pathHosts: string;
  pxeLegacy: string;
  pxeUefi: string;
  pxeConfig: string;
}
