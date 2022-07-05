import { AppState } from '@store/app.state';
import { Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { AccountDataModel } from "@shared/model/backend-api/accountDataModel";

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {
  loggedAccount: AccountDataModel;
  constructor(private store: Store) {
    this.store.select(AppState.accountBasicData).pipe(untilDestroyed(this)).subscribe(accountData => {
      if (accountData) { this.loggedAccount = accountData.account; }
    });
  }
}
