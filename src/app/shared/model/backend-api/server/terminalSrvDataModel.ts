import {ServerDataModel} from "@shared/model/backend-api/server/serverDataModel";

export interface TerminalSrvDataModel extends ServerDataModel {
  domain: string;
  portRDP: number;
  portHeartBeat: number;
  minSessions: number;
  maxSessions: number;
  priority: number;
  hasCollector: boolean;
  failoverHostname: string;
}
