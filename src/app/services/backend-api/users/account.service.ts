import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AccountDataModel } from '@shared/model/backend-api/accountDataModel';
import { AccountPasswordChangeDataModel } from '@shared/model/backend-api/accountPasswordChangeDataModel';
import { ResultDataModel } from "@shared/model/backend-api/resultDataModel";

const URL_ACCOUNT = 'api/account';
const URL_ACCOUNT_BY_EMAIL = 'api/account/{email}';
const URL_ACCOUNT_ACTIVATION = 'api/account/{accountId}/{code}';
const URL_ACCOUNT_CHANGE_PASSWORD = 'api/account/change-password';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private http: HttpClient) {}

  createAccount(account: AccountDataModel): Observable<ResultDataModel> {
    return this.http.post<ResultDataModel>(URL_ACCOUNT, account);
  }

  changePassword(accountPasswordData: AccountPasswordChangeDataModel): Observable<any> {
    return this.http.post<any>(URL_ACCOUNT_CHANGE_PASSWORD, accountPasswordData);
  }

  activateAccount(accountId: number, code: number): Observable<ResultDataModel> {
    return this.http.get<ResultDataModel>(URL_ACCOUNT_ACTIVATION
        .replace('{accountId}', accountId.toString())
        .replace('{code}', code.toString()));
  }

  checkAccountAvailability(email: string): Observable<boolean> {
    return this.http.get<boolean>(URL_ACCOUNT_BY_EMAIL.replace('{email}', email));
  }
}
