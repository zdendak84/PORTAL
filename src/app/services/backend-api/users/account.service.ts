import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AccountDataModel } from '@shared/model/backend-api/accountDataModel';
import { AccountPasswordChangeDataModel } from '@shared/model/backend-api/accountPasswordChangeDataModel';

const URL_ACCOUNT = 'api/account';
const URL_ACCOUNT_CHANGE_PASSWORD = 'api/account/change-password';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private http: HttpClient) {}

  createUser(account: AccountDataModel): Observable<AccountDataModel> {
    return this.http.post<AccountDataModel>(URL_ACCOUNT, account);
  }

  changeUserPassword(accountPasswordData: AccountPasswordChangeDataModel): Observable<any> {
    return this.http.post<any>(URL_ACCOUNT_CHANGE_PASSWORD, accountPasswordData);
  }
}
