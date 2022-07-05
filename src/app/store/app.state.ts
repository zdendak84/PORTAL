import { Action, Selector, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { AppStateModel } from './app.model';
import { CleanStore, SetAccountBasicData } from './app.actions';
import { AccountStateDataModel } from "@shared/model/state/account-state-data.model";
import { Injectable } from '@angular/core';

@State<AppStateModel>({
  name: 'portal',
  defaults: {
    accountBasicData: (sessionStorage.getItem('account')) ? JSON.parse(sessionStorage.getItem('account')) : null
  }
})
@Injectable({
  providedIn: 'root'
})

export class AppState {

  @Selector()
  static accountBasicData(state: AppStateModel): AccountStateDataModel {
    return state.accountBasicData;
  }

  @Action(CleanStore)
  cleanStore(ctx: StateContext<AppStateModel>): void {
    ctx.setState(
      patch({codeBooks: null, accountBasicData: null})
    );
  }

  @Action(SetAccountBasicData)
  setUserBasicData(ctx: StateContext<AppStateModel>, action: SetAccountBasicData): void {
    ctx.setState(
        patch({accountBasicData: action.accountBasicData})
    );
  }
}
