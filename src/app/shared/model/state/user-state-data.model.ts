import {UserDataModel} from "@shared/model/backend-api/userDataModel";

export interface UserStateDataModel {
  user: UserDataModel;
  jwt: string;
}
