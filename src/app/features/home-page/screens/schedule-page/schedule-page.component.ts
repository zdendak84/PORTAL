import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppState } from "@store/app.state";
import { ColumnData } from "@shared/model/column-data-model";
import { Component, OnInit } from '@angular/core';
import { DeviceUtils } from "@shared/utils/device-utils";
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ModalEventEnum } from "@shared/model/enums/modalEventEnum";
import { SnackbarService } from '@services/utility/snackbar.service';
import { Store } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ScheduleService } from "@services/backend-api/schedule/schedule.service";
import { forkJoin } from "rxjs";
import { DoctorDataModel } from "@shared/model/backend-api/doctorDataModel";
import { RoomDataModel } from "@shared/model/backend-api/roomDataModel";
import { ScheduleDataModel } from "@shared/model/backend-api/schedule/scheduleDataModel";
import { ScheduleDateDataModel } from "@shared/model/backend-api/schedule/scheduleDateDataModel";
import { SchedulePeriodDataModel } from "@shared/model/backend-api/schedule/schedulePeriodDataModel";
import { DAYS_NAME } from "@shared/constants/dropdown.constants";
import { UserDataModel } from "@shared/model/backend-api/userDataModel";
import { ScheduleReservationModalComponent } from "../../components/schedule-reservation-modal/schedule-reservation-modal.component";
import { YesNoModalComponent } from "@shared/components/yes-no-modal/yes-no-modal.component";
import { SetSchedulePeriod } from "@store/app.actions";

@UntilDestroy()
@Component({
  selector: 'app-schedule-page',
  templateUrl: './schedule-page.component.html',
  styleUrls: ['./schedule-page.component.css']
})
export class SchedulePageComponent implements OnInit {
  readonly dayNames = DAYS_NAME;
  readonly fieldRequired = 'Toto pole je povinné';
  columnData: ColumnData[];
  dataSource: MatTableDataSource<ScheduleDateDataModel>;
  doctors: DoctorDataModel[];
  loading: boolean;
  filter: string;
  periods: SchedulePeriodDataModel[];
  rooms: RoomDataModel[];
  searchForm: FormGroup;
  schedule: ScheduleDataModel[];
  user: UserDataModel;
  workplaceId: number;

  constructor(
    public device: DeviceUtils,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    private snackbarService: SnackbarService,
    private store: Store) {}

  get period(): AbstractControl {
    return this.searchForm.get('period');
  }

  get displayedColumns(): string[] {
    return this.columnData.map(i => i.displayed);
  }

  get dialogWidth(): string {
    return this.device.isDesktop ? '400px' : '300px';
  }

  get isDesktop(): Boolean {
    return this.device.isDesktop;
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<ScheduleDateDataModel>([]);
    this.filter = this.store.selectSnapshot(AppState.schedulePeriod);
    this.user = this.store.selectSnapshot(AppState.userData);
    this.workplaceId = this.store.selectSnapshot(AppState.listingFilter).workplaceId;
    this.loading = true;
    this.scheduleService.getSchedulePeriod(this.workplaceId).subscribe(data => {
      if (data) {
        this.periods = data;
        this.filter = this.filter ? this.filter : data[0]?.period;
      }
      this.loading = false;
      this.createSearchForm();
      this.onChange();
    });
  }

  getDayName(dayOfWeek: number): string {
    return this.dayNames.find(f => f.value === dayOfWeek)?.name;
  }

  getButtonColor(): string {
    return this.user.admin ? '#aaffff' : '#ffff00';
  }

  getDoctorName(date: string, shiftNumber: number, rowNumber: number): string {
    const doctorId=this.getShift(date, shiftNumber, rowNumber)?.doctorId;
    return doctorId ? this.doctors.find(f => f.doctorId === doctorId)?.lastName : null;
  }

  getShiftButton(date: string, shiftNumber: number, rowNumber: number): boolean {
    const shift = this.getShift(date, shiftNumber, rowNumber);
    if (!shift?.shiftAvailable) {
      if (shift?.shiftCancelable && (this.user.admin || (this.user.doctorId === shift?.doctorId))) return true;
    }
    return false;
  }

  getShiftAvailability(date: string, rowNumber: number): boolean {
    return this.schedule.filter(f => f.date === date &&
        f.roomId === this.getRoomId(rowNumber) && f.shiftAvailable === true).length >0;
  }

  onChange(): void {
    if (this.period.value) {
      this.store.dispatch(new SetSchedulePeriod(this.period.value));
      this.getSchedule();
    }
  }

  onShiftClick(date: string, shiftNumber: number, rowNumber: number): void {
    const shift = this.getShift(date, shiftNumber, rowNumber);
    if (shift) {
      if (shift.shiftCancelable && shift.sumOfPatients === 0) {
        this.cancelShift(shift.shiftId, date);
        return;
      }
      if (!shift.shiftCancelable && shift.sumOfPatients === 0) {
        this.snackbarService.openInfoSnackBar('Termnín již nelze upravovat');
        return;
      }
      this.snackbarService.openInfoSnackBar(`Operací: ${shift.sumOfPatients}, alokováno: ${shift.sumOfMinutes} min.`);
    }
  }

  onAvailableShiftClick(date: string, rowNumber: number): void {
    this.reserveShift(date, rowNumber);
  }

  /* nastaveni smeny */
  private reserveShift(date: string, rowNumber: number): void {
    let dialog;
    dialog = this.dialog.open(ScheduleReservationModalComponent, {
      disableClose: true,
      width: this.dialogWidth,
      data: {admin: this.user.admin, doctorId: this.user.doctorId, doctors: this.doctors,
        roomId: this.getRoomId(rowNumber), date: date}
    });
    dialog.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result.event === ModalEventEnum.Create) {
        this.scheduleService.reserveShift(result.data.shiftId, result.data.doctorId, date).subscribe(data => {
          if (data?.result === 1) {
            this.getSchedule();
          } else {
            this.snackbarService.openErrorSnackBar('Termín se nepodařilo zrušit');
          }
        });
      }
    });
  }

  /* zruseni smeny */
  private cancelShift(shiftId: number, date: string): void {
    let dialog;
    dialog = this.dialog.open(YesNoModalComponent, {
      disableClose: true,
      width: this.dialogWidth,
      data: {
        body: ``,
        header: 'Opravdu chcete termín zrušit?'}
    });
    dialog.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result.result) {
        this.scheduleService.cancelShift(shiftId, date).subscribe(data => {
          if (data?.result === 1) {
            this.getSchedule();
          } else {
            this.snackbarService.openErrorSnackBar('Termín se nepodařilo zrušit');
          }
        });
      }
    });
  }

  private createSearchForm(): void {
    this.searchForm = this.fb.group({
      period: [this.filter, Validators.required]
    });
  }

  private getRoomId(rowNumber: number): number {
    return this.rooms.find(f => f.rowNumber === (rowNumber + 1))?.roomId;
  }

  private getShift(date: string, shiftNumber: number, rowNumber: number): ScheduleDataModel {
    return this.schedule.find(f => f.date === date &&
        f.shiftNumber === shiftNumber && f.roomId === this.getRoomId(rowNumber) && f.doctorId !== null);
  }

  private getSchedule(): void {
    const period = this.period.value ? this.period.value : null;
    const workplaceId = this.workplaceId;

    const rooms$ = this.scheduleService.getScheduleRoom(workplaceId, period);
    const doctors$ = this.scheduleService.getScheduleDoctor(workplaceId);
    const dates$ = this.scheduleService.getScheduleDate(workplaceId, period);
    const schedule$ = this.scheduleService.getSchedule(workplaceId, period);
    this.loading = true;
    forkJoin([rooms$, doctors$, dates$, schedule$]).subscribe(result => {
      if (result) {
        this.rooms = result[0];
        this.doctors = result[1];
        this.dataSource.data = result[2];
        this.schedule = result[3];

        this.columnData=[{ displayed: 'date', name: 'Den' }];
        this.rooms.map(m => {
          this.columnData.push({ displayed: m.number, name: m.description });
        });
      } else {
        this.dataSource.data = null;
        this.snackbarService.openInfoSnackBar('Žádné záznamy k zobrazení');
      }
      this.loading = false;
    });
  }
}
