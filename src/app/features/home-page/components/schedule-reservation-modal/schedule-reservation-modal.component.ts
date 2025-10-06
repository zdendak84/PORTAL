import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Component, Inject, OnInit } from '@angular/core';
import { DoctorDataModel } from "@shared/model/backend-api/doctorDataModel";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalEventEnum } from '@shared/model/enums/modalEventEnum';
import { ShiftDataModel } from "@shared/model/backend-api/schedule/shiftDataModel";
import { ScheduleService } from "@services/backend-api/schedule/schedule.service";

@Component({
    selector: 'app-schedule-reservation-modal-component',
    templateUrl: './schedule-reservation-modal.component.html',
    styleUrls: ['./schedule-reservation-modal.component.css'],
    standalone: false
})
export class ScheduleReservationModalComponent implements OnInit {
  readonly fieldRequired = 'Toto pole je povinné';
  edit = false;
  loading = false;
  shifts: ShiftDataModel[];
  shiftForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService,
    public dialogRef: MatDialogRef<ScheduleReservationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { doctorId: number, admin: boolean,
      doctors: DoctorDataModel[], roomId: number, date: string }
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.scheduleService.getShift(this.data.roomId, this.data.date).subscribe(data => {
      if (data) {
        this.shifts = data;
      }
      this.loading = false;
      this.createShiftForm();
    });
  }

  onNoClick(): void {
    this.dialogRef.close({event: ModalEventEnum.Cancel});
  }

  onSubmit(): void {
    if (this.shiftForm.invalid) {
      return;
    }
    const formData = {...this.shiftForm.value};
    this.dialogRef.close({event: ModalEventEnum.Create, data: formData});
  }

  private createShiftForm(): void {
    this.shiftForm = this.fb.group({
      shiftId: [null, Validators.required],
      doctorId: [this.data.doctorId]
    });
  }
}
