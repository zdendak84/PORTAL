import { InjuryCodebook } from "@shared/model/backend-api/codebooks/injuryCodebook";
import { OperationCodebook } from "@shared/model/backend-api/codebooks/operationCodebook";
import { InsuranceCodebook } from "@shared/model/backend-api/codebooks/insuranceCodebook";

export interface CodebooksDataModel {
  injuries: InjuryCodebook[];
  operations: OperationCodebook[];
  insurances: InsuranceCodebook[];
}
