import { Action, Selector, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { AppStateModel } from './app.model';
import { CleanStore, SetUserBasicData } from './app.actions';
import { UserStateDataModel } from "@shared/model/state/user-state-data.model";
import { Injectable } from '@angular/core';

@State<AppStateModel>({
  name: 'appd',
  defaults: {
    userBasicData: (sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : null
  }
})
@Injectable({
  providedIn: 'root'
})

export class AppState {

  @Selector()
  static userBasicData(state: AppStateModel): UserStateDataModel {
    return state.userBasicData;
  }

  @Action(CleanStore)
  cleanStore(ctx: StateContext<AppStateModel>): void {
    ctx.setState(
      patch({codeBooks: null, userBasicData: null})
    );
  }

  @Action(SetUserBasicData)
  setUserBasicData(ctx: StateContext<AppStateModel>, action: SetUserBasicData): void {
    ctx.setState(
        patch({userBasicData: action.userBasicData})
    );
  }
}
