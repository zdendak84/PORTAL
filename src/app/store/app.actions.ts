import { CodebooksDataModel } from "@shared/model/backend-api/codebooks/codebooksDataModel";
import { ExaminationDataModel } from "@shared/model/backend-api/examinationDataModel";
import { ListingFilterModel } from "@shared/model/filters/listingFilterModel";
import { LocationDataModel } from "@shared/model/backend-api/locationDataModel";
import { UserStateDataModel } from "@shared/model/state/user-state-data.model";
import { WorkplaceDataModel } from "@shared/model/backend-api/workplaceDataModel";

export class SetCodeBooks {
  static readonly type = '[App] Set codeBooks data';
  constructor(public codeBooks: CodebooksDataModel) {}
}

export class SetExaminations {
  static readonly type = '[App] Set user examinations';
  constructor(public examinations: ExaminationDataModel[]) {}
}

export class SetLocations {
  static readonly type = '[App] Set user locations';
  constructor(public locations: LocationDataModel[]) {}
}

export class SetWorkplaces {
  static readonly type = '[App] Set user workplaces';
  constructor(public workplaces: WorkplaceDataModel[]) {}
}

export class CleanStore {
  static readonly type = '[App] Clean store';
  constructor() {}
}

export class SetListingFilter {
  static readonly type = '[App] Set listing filter';
  constructor(public listingFilter: ListingFilterModel) {}
}

export class SetSchedulePeriod {
  static readonly type = '[App] Set schedule period filter';
  constructor(public schedulePeriod: string) {}
}

export class SetUserBasicData {
  static readonly type = '[App] Set user data';
  constructor(public userBasicData: UserStateDataModel) {}
}
