import { AccountStateDataModel } from "@shared/model/state/account-state-data.model";

export class CleanStore {
  static readonly type = '[App] Clean store';
  constructor() {}
}

export class SetAccountBasicData {
  static readonly type = '[App] Set account data';
  constructor(public accountBasicData: AccountStateDataModel) {}
}
