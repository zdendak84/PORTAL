import {AccountDataModel} from "@shared/model/backend-api/accountDataModel";

export interface AuthenticationResponseDataModel {
  account: AccountDataModel;
  jwt: string;
}
