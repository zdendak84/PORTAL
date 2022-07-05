import { UserStateDataModel } from "@shared/model/state/user-state-data.model";

export class CleanStore {
  static readonly type = '[App] Clean store';
  constructor() {}
}

export class SetUserBasicData {
  static readonly type = '[App] Set user data';
  constructor(public userBasicData: UserStateDataModel) {}
}
