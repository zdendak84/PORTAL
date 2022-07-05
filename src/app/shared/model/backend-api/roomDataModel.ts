import {DependencyModel} from "@shared/model/backend-api/dependencyModel";

export interface RoomDataModel extends DependencyModel {
  roomId: number;
  name: string;
  buildingId: number;
  number: string;
  floor: number;
  costsUnit: string;
  description: string;
}
