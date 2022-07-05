import {DependencyModel} from "@shared/model/backend-api/dependencyModel";

export interface ServerDataModel extends DependencyModel {
  hostname: string;
  description: string;
  ipAddress: string;
  active: boolean;
}
