import { Action, Selector, State, StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';

import { AppStateModel } from './app.model';
import { CleanStore, SetCodeBooks, SetExaminations, SetLocations, SetWorkplaces, SetListingFilter, SetUserBasicData } from './app.actions';
import { UserStateDataModel } from "@shared/model/state/user-state-data.model";
import { Injectable } from '@angular/core';
import { ListingFilterModel } from "@shared/model/filters/listingFilterModel";
import { WorkplaceDataModel } from "@shared/model/backend-api/workplaceDataModel";
import { LocationDataModel } from "@shared/model/backend-api/locationDataModel";
import { ExaminationDataModel } from "@shared/model/backend-api/examinationDataModel";
import { BodyPartCodebook } from "@shared/model/backend-api/codebooks/bodyPartCodebook";
import { InsuranceCodebook } from "@shared/model/backend-api/codebooks/insuranceCodebook";
import { InjuryCodebook } from "@shared/model/backend-api/codebooks/injuryCodebook";
import { OperationCodebook } from "@shared/model/backend-api/codebooks/operationCodebook";

@State<AppStateModel>({
  name: 'portal',
  defaults: {
    codeBooks: null,
    examinations: null,
    locations: null,
    workplaces: null,
    userBasicData: (sessionStorage.getItem('user')) ? JSON.parse(sessionStorage.getItem('user')) : null,
    listingFilter: null,
  }
})
@Injectable({
  providedIn: 'root'
})

export class AppState {

  @Selector()
  static examinations(state: AppStateModel): ExaminationDataModel[] {
    return state.examinations;
  }

  @Selector()
  static bodyPart(state: AppStateModel): BodyPartCodebook[] {
    return state.codeBooks.bodyParts;
  }

  @Selector()
  static injury(state: AppStateModel): InjuryCodebook[] {
    return state.codeBooks.injuries;
  }

  @Selector()
  static insurance(state: AppStateModel): InsuranceCodebook[] {
    return state.codeBooks.insurances;
  }

  @Selector()
  static locations(state: AppStateModel): LocationDataModel[] {
    return state.locations;
  }

  @Selector()
  static operation(state: AppStateModel): OperationCodebook[] {
    return state.codeBooks.operations;
  }

  @Selector()
  static workplaces(state: AppStateModel): WorkplaceDataModel[] {
    return state.workplaces;
  }

  @Selector()
  static listingFilter(state: AppStateModel): ListingFilterModel {
    return state.listingFilter;
  }

  @Selector()
  static userBasicData(state: AppStateModel): UserStateDataModel {
    return state.userBasicData;
  }

  @Action(SetCodeBooks)
  setCodeBooks(ctx: StateContext<AppStateModel>, action: SetCodeBooks): void {
    ctx.setState(
        patch({codeBooks: action.codeBooks})
    );
  }

  @Action(SetExaminations)
  setExaminations(ctx: StateContext<AppStateModel>, action: SetExaminations): void {
    ctx.setState(
        patch({examinations: action.examinations})
    );
  }

  @Action(SetLocations)
  setLocations(ctx: StateContext<AppStateModel>, action: SetLocations): void {
    ctx.setState(
        patch({locations: action.locations})
    );
  }

  @Action(SetWorkplaces)
  setWorkplaces(ctx: StateContext<AppStateModel>, action: SetWorkplaces): void {
    ctx.setState(
        patch({workplaces: action.workplaces})
    );
  }

  @Action(CleanStore)
  cleanStore(ctx: StateContext<AppStateModel>): void {
    ctx.setState(
      patch({codeBooks: null, examinations: null, locations: null, workplaces: null, listingFilter: null,
        userBasicData: null, firstDate: null})
    );
  }

  @Action(SetListingFilter)
  setSurgeryListingFilter(ctx: StateContext<AppStateModel>, action: SetListingFilter): void {
    ctx.setState(
        patch({listingFilter: action.listingFilter})
    );
  }

  @Action(SetUserBasicData)
  setUserBasicData(ctx: StateContext<AppStateModel>, action: SetUserBasicData): void {
    ctx.setState(
        patch({userBasicData: action.userBasicData})
    );
  }
}
