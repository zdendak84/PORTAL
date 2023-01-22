import { AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import { AppState } from "@store/app.state";
import { BODYPART, SIDE} from "@shared/constants/dropdown.constants";
import { Component, Inject, OnInit } from '@angular/core';
import { InjuryCodebook } from "@shared/model/backend-api/codebooks/injuryCodebook";
import { InsuranceCodebook } from "@shared/model/backend-api/codebooks/insuranceCodebook";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalEventEnum } from '@shared/model/enums/modalEventEnum';
import { OperationCodebook } from "@shared/model/backend-api/codebooks/operationCodebook";
import { PatientService } from "@services/backend-api/patient/patient.service";
import { SlotService } from '@services/backend-api/slot/slot.service';
import { Store } from "@ngxs/store";
import { ThemePalette } from "@angular/material/core";

@Component({
  selector: 'app-slot-reservation-modal-component',
  templateUrl: './slot-reservation-modal.component.html',
  styleUrls: ['./slot-reservation-modal.component.css']
})
export class SlotReservationModalComponent implements OnInit {
  readonly fieldRequired = 'Toto pole je povinné';
  readonly wrongFormat = 'Chybný formát';
  readonly EMAIL_REGEX = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}$/;
  readonly IDS_REGEX = /^[0-9]{9,10}$/;
  readonly bodyParts = BODYPART;
  readonly sides = SIDE;
  injuries: InjuryCodebook[];
  filteredInjuries: InjuryCodebook[];
  insurances: InsuranceCodebook[];
  operations: OperationCodebook[];
  filteredOperations: OperationCodebook[];
  operationDetails: OperationCodebook[];
  loading = false;
  injuryForm: FormGroup;
  operationForm: FormGroup;
  patientForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private slotService: SlotService,
    private patientService: PatientService,
    public dialogRef: MatDialogRef<SlotReservationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {slotId: number; minDuration: number; maxDuration: number}
  ) {}

  get bodyPart(): AbstractControl {
    return this.injuryForm.get('bodyPart');
  }

  get description(): AbstractControl {
    return this.injuryForm.get('slotDescription');
  }

  get injury(): AbstractControl {
    return this.injuryForm.get('injury');
  }

  get side(): AbstractControl {
    return this.injuryForm.get('side');
  }

  get duration(): AbstractControl {
    return this.operationForm.get('duration');
  }

  get operation(): AbstractControl {
    return this.operationForm.get('operation');
  }

  get operationDetail(): AbstractControl {
    return this.operationForm.get('operationDetail');
  }

  get rehabilitation(): AbstractControl {
    return this.operationForm.get('rehabilitation');
  }

  get city(): AbstractControl {
    return this.patientForm.get('city');
  }

  get email(): AbstractControl {
    return this.patientForm.get('email');
  }

  get firstName(): AbstractControl {
    return this.patientForm.get('firstName');
  }

  get gender(): AbstractControl {
    return this.patientForm.get('gender');
  }

  get insuranceId(): AbstractControl {
    return this.patientForm.get('insuranceId');
  }

  get insuranceNumber(): AbstractControl {
    return this.patientForm.get('insuranceNumber');
  }

  get lastName(): AbstractControl {
    return this.patientForm.get('lastName');
  }

  get patientId(): AbstractControl {
    return this.patientForm.get('patientId');
  }

  get street(): AbstractControl {
    return this.patientForm.get('street');
  }

  get telephone(): AbstractControl {
    return this.patientForm.get('telephone');
  }

  ngOnInit(): void {
    this.injuries = this.store.selectSnapshot(AppState.injury);
    this.insurances = this.store.selectSnapshot(AppState.insurance);
    this.operations = this.store.selectSnapshot(AppState.operation);
    this.createInjuryForm();
    this.createOperationForm();
    this.createPatientForm();
  }

  /*
  changeDuration(shift: number): void {
    const duration = +this.duration.value + (shift * this.data.minDuration);
    if (duration >= this.data.minDuration && duration <= this.data.maxDuration) {
      this.duration.setValue(duration);
    }
  }
  */

  getColor(duration: number): ThemePalette {
    return this.duration.value === duration ? 'accent' : 'primary';
  }

  onChangeBodyPart(): void {
    this.injury.reset();
    this.operation.reset();
    this.filteredInjuries = this.injuries.filter(f => f.bodyPart === this.bodyPart.value);
    this.filteredOperations = [];
    this.operations.filter(f => f.bodyPart === this.bodyPart.value).map(o => {
      if (this.filteredOperations.filter(f => f.operation === o.operation).length === 0) {
        this.filteredOperations.push(o);
      }
    });
  }

  onChangeOperation(): void {
    this.operationDetail.reset();
    this.operationDetails = this.operations.filter(f => f.operation === this.operation.value && f.operationDetail !== null);
  }

  onChangeCity(): void {
    if (this.city.value.length > 0) {
      this.city.setValue(this.capitalizeFirstLetter(this.inverseCaps(this.city.value)));
    }
  }

  onChangeEmail(): void {
    if (this.email.value.length > 0) {
      this.email.setValue(this.inverseCaps(this.email.value));
    }
  }

  onChangeFirstName(): void {
    if (this.firstName.value.length > 0) {
      this.firstName.setValue(this.capitalizeFirstLetter(this.inverseCaps(this.firstName.value)));
    }
  }

  onChangeLastName(): void {
    if (this.lastName.value.length > 0) {
      this.lastName.setValue(this.capitalizeFirstLetter(this.inverseCaps(this.lastName.value)));
    }
  }

  onChangeStreet(): void {
    if (this.street.value.length > 0) {
      this.street.setValue(this.capitalizeFirstLetter(this.inverseCaps(this.street.value)));
    }
  }

  onChangeInsuranceNumber(): void {
    const insuranceNumber = this.insuranceNumber.value;
    if (insuranceNumber) {
      this.loading = true;
      this.patientService.getPatientByInsuranceNumber(insuranceNumber).subscribe(data => {

        const patient = data ? data : {firstName : null, lastName : null, insuranceNumber : null,
          insuranceId : null, gender : null, dayOfBirth : null, street : null, buildingNumber : null,
          registrationBuildingNumber : null, city : null, zipCode : null, telephone : null,
          email : null, patientId : null, mpiId : null}

        this.patientForm.get('firstName').setValue(patient.firstName);
        this.patientForm.get('lastName').setValue(patient.lastName);
        this.patientForm.get('insuranceId').setValue(patient.insuranceId);
        this.patientForm.get('gender').setValue(patient.gender);
        this.patientForm.get('dayOfBirth').setValue(patient.dayOfBirth);
        this.patientForm.get('street').setValue(patient.street);
        this.patientForm.get('buildingNumber').setValue(patient.buildingNumber);
        this.patientForm.get('registrationBuildingNumber').setValue(patient.registrationBuildingNumber);
        this.patientForm.get('city').setValue(patient.city, {emitEvent: false});
        this.patientForm.get('zipCode').setValue(patient.zipCode);
        this.patientForm.get('telephone').setValue(patient.telephone);
        this.patientForm.get('email').setValue(patient.email);
        this.patientForm.get('patientId').setValue(patient.patientId);
        this.patientForm.get('mpiId').setValue(patient.mpiId);
        this.loading = false;
        if (patient.patientId === null) {
          this.parseInsuranceNumber(insuranceNumber);
        }
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close({event: ModalEventEnum.Cancel});
  }

  onSubmit(): void {
    if (this.patientForm.invalid || this.injuryForm.invalid) {
      return;
    }
    const operation = {...this.injuryForm.value, ...this.operationForm.value,
      rehabilitation: this.rehabilitation.value ? (this.rehabilitation.value ? 1 : 0) : 0};
    const formData = {operation: operation, patient: this.patientForm.value, description: this.description.value};
    this.dialogRef.close({event: ModalEventEnum.Create, data: formData});
  }

  setDuration(duration: number): void {
    this.duration.setValue(duration);
  }

  private capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  private createInjuryForm(): void {
    this.injuryForm = this.fb.group({
      side: [null, Validators.required],
      bodyPart: [null, Validators.required],
      injury: [null, Validators.required],
      injuryDescription: [null],
      slotDescription: [null]
    });
  }

  private createOperationForm(): void {
    this.operationForm = this.fb.group({
      operation: [null, Validators.required],
      operationDetail: [null],
      operationDescription: [null],
      rehabilitation: [null],
      duration: [this.data.minDuration, Validators.required]
    });
  }

  private createPatientForm(): void {
    this.patientForm = this.fb.group({
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      insuranceNumber: [null, [Validators.required, Validators.pattern(this.IDS_REGEX)]],
      insuranceId: [null, Validators.required],
      gender: [null],
      dayOfBirth: [null],
      street: [null],
      buildingNumber: [null],
      registrationBuildingNumber: [null],
      city: [null],
      zipCode: [null],
      telephone: [null, Validators.required],
      email: [null, Validators.pattern(this.EMAIL_REGEX)],
      patientId: [null],
      mpiId: [null]
    });
  }

  private inverseCaps(value: string): string {
    return (value === value.toUpperCase()) ? value.toLowerCase() : value;
  }

  private parseInsuranceNumber(insuranceNumber: string): void {
    const yearYY = +insuranceNumber.substring(0, 2);
    const monthMM = +insuranceNumber.substring(2, 4);
    const day = +insuranceNumber.substring(4, 6);
    const year = (insuranceNumber.length === 10 && yearYY < 54) ? (yearYY + 2000) : (yearYY + 1900);
    const month = (monthMM < 50) ? monthMM : (monthMM - 50);

    if (day > 0 && day < 32 && month > 0 && month < 13 && year > 1899 && year < 2100) {
      this.patientForm.get('dayOfBirth').setValue(`${year}-${month}-${day}`);
      this.gender.setValue(((monthMM < 50) ? 1 : 2));
    }

    /*
    if (this.insuranceId.value === null) {
      this.loading = true;
      const b2b = this.communicationService.validateInsurance(insuranceNumber).subscribe(data => {
        if (data) {
          this.insuranceId.setValue(data.result);
        } else {
          this.snackbarService.openErrorSnackBar('Pojištění pacienta se nepodařilo ověřit nebo rodné číslo neexistuje.');
        }
        this.loading = false;
      });
      setTimeout(() => {
        if (this.loading) {
          b2b.unsubscribe();
          this.loading = false;
          this.snackbarService.openErrorSnackBar('Ze serveru VZP nepřišla včas odpověď!');
        }
      }, 5000);
    }
     */
  }
}
