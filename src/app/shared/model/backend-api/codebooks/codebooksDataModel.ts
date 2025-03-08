import { BodyPartCodebook } from "@shared/model/backend-api/codebooks/bodyPartCodebook";
import { InjuryCodebook } from "@shared/model/backend-api/codebooks/injuryCodebook";
import { OperationCodebook } from "@shared/model/backend-api/codebooks/operationCodebook";
import { InsuranceCodebook } from "@shared/model/backend-api/codebooks/insuranceCodebook";
import { BodySideCodebook } from "@shared/model/backend-api/codebooks/bodySideCodebook";

export interface CodebooksDataModel {
  bodyParts: BodyPartCodebook[];
  bodySides: BodySideCodebook[];
  injuries: InjuryCodebook[];
  operations: OperationCodebook[];
  insurances: InsuranceCodebook[];
}
