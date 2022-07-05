import {AccountDataModel} from "@shared/model/backend-api/accountDataModel";

export interface AccountStateDataModel {
  account: AccountDataModel;
  jwt: string;
}
