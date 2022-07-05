import { DependencyModel } from "@shared/model/backend-api/dependencyModel";
import { TerminalSrvDataModel } from "@shared/model/backend-api/server/terminalSrvDataModel";

export interface TerminalSrvPoolDataModel extends DependencyModel {
  poolName: string;
  description: string;
  terminalSrv: TerminalSrvDataModel[];
}
