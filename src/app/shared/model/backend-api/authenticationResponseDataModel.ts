import { UserDataModel } from "@shared/model/backend-api/userDataModel";

export interface AuthenticationResponseDataModel {
  user: UserDataModel;
  jwt: string;
}
