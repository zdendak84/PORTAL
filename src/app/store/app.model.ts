import { CodebooksDataModel } from "@shared/model/backend-api/codebooks/codebooksDataModel";
import { ExaminationDataModel } from "@shared/model/backend-api/examinationDataModel";
import { ListingFilterModel } from "@shared/model/filters/listingFilterModel";
import { LocationDataModel } from "@shared/model/backend-api/locationDataModel";
import { UserStateDataModel } from "@shared/model/state/user-state-data.model";
import { WorkplaceDataModel } from "@shared/model/backend-api/workplaceDataModel";

export interface AppStateModel {
  codeBooks: CodebooksDataModel;
  examinations: ExaminationDataModel[];
  locations: LocationDataModel[];
  workplaces: WorkplaceDataModel[];
  userBasicData: UserStateDataModel;
  listingFilter: ListingFilterModel;
}
