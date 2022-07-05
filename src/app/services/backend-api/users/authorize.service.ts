import { AppState } from '@store/app.state';
import { Store } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { UserDataModel } from "@shared/model/backend-api/userDataModel";

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {
  loggedUser: UserDataModel;
  constructor(private store: Store) {
    this.store.select(AppState.userBasicData).pipe(untilDestroyed(this)).subscribe(userData => {
      if (userData) { this.loggedUser = userData.user; }
    });
  }
}
