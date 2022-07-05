import {ServerDataModel} from "@shared/model/backend-api/server/serverDataModel";

export interface BootSrvDataModel extends ServerDataModel {
  dhcpFirstIpAddress: string;
  dhcpLastIpAddress: string;
  dhcpSubnet: string;
  dhcpNetmask: string;
  dhcpGateway: string;
  dhcpDns: string;
  dhcpLeaseDefault: number;
  dhcpLeaseMaximum: number;
  dhcpConfigFile: string;
  dhcpInitScript: string;
  pathNfs: string;
  pathTftp: string;
  pathHostsFiles: string;
  pathMacFiles: string;
  filesInitScript: string;
  status: number;
}
