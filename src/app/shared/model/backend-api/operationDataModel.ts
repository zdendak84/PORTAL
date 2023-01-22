export interface OperationDataModel {
  side: number;
  bodyPart: number;
  injury: string;
  injuryDescription: string;
  operation: string;
  operationDetail: string;
  operationDescription: string;
  rehabilitation: boolean;
  duration: number;
  sideText?: string;
  bodyPartText?: string;
}
