export interface ScheduleDataModel {
  date: string;
  roomId: number;
  doctorId: number;
  shiftId: number;
  shiftNumber: number;
  shiftAvailable: boolean;
  shiftCancelable: boolean;
  sumOfPatients: number;
  sumOfMinutes: number;
}
