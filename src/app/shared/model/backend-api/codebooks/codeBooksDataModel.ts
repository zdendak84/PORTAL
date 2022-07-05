import { ConfigCodeBook } from "@shared/model/backend-api/codebooks/configCodeBook";
import { BootImageDataModel } from "@shared/model/backend-api/codebooks/bootImageDataModel";
import { BootApplicationDataModel } from "@shared/model/backend-api/codebooks/bootApplicationDataModel";

export interface CodeBooksDataModel {
  configValues: ConfigCodeBook[];
  configDefaults: ConfigCodeBook[];
  bootImage : BootImageDataModel[];
  bootApplication: BootApplicationDataModel[];
}