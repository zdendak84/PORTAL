import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Navigate } from '@ngxs/router-plugin';

import { AuthenticationResponseDataModel } from '@shared/model/backend-api/authenticationResponseDataModel';
import { AuthenticationRequestDataModel } from '@shared/model/backend-api/authenticationRequestDataModel';
import { Store } from '@ngxs/store';
import { CleanStore, SetAccountBasicData } from '@store/app.actions';
import { AppRoutes } from '../../../app.routes';

const URL_POST_LOGIN = 'api/authenticate';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private store: Store) {}

  login(loginData: AuthenticationRequestDataModel): Observable<AuthenticationResponseDataModel> {
    return this.http.post<AuthenticationResponseDataModel>(URL_POST_LOGIN, loginData)
      .pipe(map(account => {
        if (account.account && account.jwt) {
          sessionStorage.setItem('account', JSON.stringify(account));
          this.store.dispatch(new SetAccountBasicData(account));
        }
        return account;
      }));
  }

  logout(): void {
    sessionStorage.removeItem('account');
    this.store.dispatch(new CleanStore());
    this.store.dispatch(new Navigate([AppRoutes.LOGIN]));
  }
}
