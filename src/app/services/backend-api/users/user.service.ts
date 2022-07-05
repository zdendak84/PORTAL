import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserDataModel } from '@shared/model/backend-api/userDataModel';
import { UserPasswordChangeDataModel } from '@shared/model/backend-api/userPasswordChangeDataModel';

const URL_USER = 'api/user';
const URL_USER_BY_ID = 'api/user/{userId}';
const URL_USER_RESET_PASSWORD = 'api/user/reset-password';
const URL_USER_CHANGE_PASSWORD = 'api/user/change-password';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserDataModel[]> {
    return this.http.get<UserDataModel[]>(URL_USER);
  }

  createUser(user: UserDataModel): Observable<UserDataModel> {
    return this.http.post<UserDataModel>(URL_USER, user);
  }

  updateUser(user: UserDataModel): Observable<UserDataModel> {
    return this.http.put<UserDataModel>(URL_USER_BY_ID.replace('{userId}', user.userId.toString()), user);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(URL_USER_BY_ID.replace('{userId}', userId.toString()));
  }

  resetUserPassword(user: UserDataModel): Observable<UserDataModel> {
    return this.http.post<UserDataModel>(URL_USER_RESET_PASSWORD, user);
  }

  changeUserPassword(userPasswordData: UserPasswordChangeDataModel): Observable<any> {
    return this.http.post<any>(URL_USER_CHANGE_PASSWORD, userPasswordData);
  }
}
