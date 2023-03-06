import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DoctorDataModel } from "@shared/model/backend-api/doctorDataModel";
import { RoomDataModel } from "@shared/model/backend-api/roomDataModel";
import { ScheduleDataModel } from "@shared/model/backend-api/schedule/scheduleDataModel";
import { ScheduleDateDataModel } from "@shared/model/backend-api/schedule/scheduleDateDataModel";
import { SchedulePeriodDataModel } from "@shared/model/backend-api/schedule/schedulePeriodDataModel";
import { ShiftDataModel } from "@shared/model/backend-api/schedule/shiftDataModel";
import { ResultDataModel } from "@shared/model/backend-api/resultDataModel";

const URL_GET_SCHEDULE_PERIOD = 'api/schedule-period/{workplaceId}';
const URL_GET_SCHEDULE_ROOM = 'api/schedule-room/{workplaceId}/{period}';
const URL_GET_SCHEDULE_DATE = 'api/schedule-date/{workplaceId}/{period}';
const URL_GET_SCHEDULE_DOCTOR = 'api/schedule-doctor/{workplaceId}';
const URL_GET_SCHEDULE = 'api/schedule/{workplaceId}/{period}';
const URL_GET_SHIFT = 'api/shift/{roomId}/{date}';
const URL_POST_SCHEDULE = 'api/schedule';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  constructor(private http: HttpClient) {}

  getSchedulePeriod(workplaceId: number): Observable<SchedulePeriodDataModel[]> {
    return this.http.get<SchedulePeriodDataModel[]>(URL_GET_SCHEDULE_PERIOD
      .replace('{workplaceId}', workplaceId.toString()));
  }

  getScheduleDate(workplaceId: number, period: string): Observable<ScheduleDateDataModel[]> {
    return this.http.get<ScheduleDateDataModel[]>(URL_GET_SCHEDULE_DATE
        .replace('{workplaceId}', workplaceId.toString())
        .replace('{period}', period));
  }

  getScheduleRoom(workplaceId: number, period: string): Observable<RoomDataModel[]> {
    return this.http.get<RoomDataModel[]>(URL_GET_SCHEDULE_ROOM
        .replace('{workplaceId}', workplaceId.toString())
        .replace('{period}', period));
  }

  getScheduleDoctor(workplaceId: number): Observable<DoctorDataModel[]> {
    return this.http.get<DoctorDataModel[]>(URL_GET_SCHEDULE_DOCTOR
        .replace('{workplaceId}', workplaceId.toString()));
  }

  getSchedule(workplaceId: number, period: string): Observable<ScheduleDataModel[]> {
    return this.http.get<ScheduleDataModel[]>(URL_GET_SCHEDULE
        .replace('{workplaceId}', workplaceId.toString())
        .replace('{period}', period));
  }

  getShift(roomId: number, date: string): Observable<ShiftDataModel[]> {
    return this.http.get<ShiftDataModel[]>(URL_GET_SHIFT
        .replace('{roomId}', roomId.toString())
        .replace('{date}', date));
  }

  reserveShift(shiftId: number, doctorId: number, date: String): Observable<ResultDataModel> {
    const shiftAction = {shiftId: shiftId, doctorId: doctorId, date: date, action: 1}
    return this.http.post<ResultDataModel>(URL_POST_SCHEDULE, shiftAction);
  }

  cancelShift(shiftId: number, date: String): Observable<ResultDataModel> {
    const shiftAction = {shiftId: shiftId, date: date, action: 0}
    return this.http.post<ResultDataModel>(URL_POST_SCHEDULE, shiftAction);
  }
}
