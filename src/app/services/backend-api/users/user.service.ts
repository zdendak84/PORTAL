import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UserPasswordChangeDataModel } from '@shared/model/backend-api/userPasswordChangeDataModel';

const URL_POST_CHANGE_PASSWORD = 'api/user/change-password';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  changeUserPassword(userPasswordData: UserPasswordChangeDataModel): Observable<any> {
    return this.http.post<any>(URL_POST_CHANGE_PASSWORD, userPasswordData);
  }
}
