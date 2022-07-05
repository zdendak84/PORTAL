import { DependencyModel } from "@shared/model/backend-api/dependencyModel";

export interface RemoteAppDataModel extends DependencyModel {
  remoteAppName: string;
  type: number;
  description: string;
  linkName: string;
  linkIcon: string;
  executableFile: string;
  commandLineOptions: string;
  workingDirectory: string;
}
