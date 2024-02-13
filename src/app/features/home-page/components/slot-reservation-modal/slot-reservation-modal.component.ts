import { AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import { AppState } from "@store/app.state";
import { BodyPartCodebook } from "@shared/model/backend-api/codebooks/bodyPartCodebook";
import { SIDE} from "@shared/constants/dropdown.constants";
import { Component, Inject, OnInit } from '@angular/core';
import { InjuryCodebook } from "@shared/model/backend-api/codebooks/injuryCodebook";
import { InsuranceCodebook } from "@shared/model/backend-api/codebooks/insuranceCodebook";
import { ListingDataModel } from "@shared/model/backend-api/listingDataModel";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalEventEnum } from '@shared/model/enums/modalEventEnum';
import { OperationCodebook } from "@shared/model/backend-api/codebooks/operationCodebook";
import { PatientDataModel } from "@shared/model/backend-api/patientDataModel";
import { PatientService } from "@services/backend-api/patient/patient.service";
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
  sides = SIDE;
  edit = false;
  bodyParts: BodyPartCodebook[];
  injuries: InjuryCodebook[];
  filteredInjuries: InjuryCodebook[];
  insurances: InsuranceCodebook[];
  operations: OperationCodebook[];
  filteredOperations: OperationCodebook[];
  operationDetails: OperationCodebook[];
  loading = false;
  addressForm: FormGroup;
  injuryForm: FormGroup;
  operationForm: FormGroup;
  patientForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private patientService: PatientService,
    public dialogRef: MatDialogRef<SlotReservationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {slot: ListingDataModel; minDuration: number; maxDuration: number}
  ) {}

  get bodyPart(): AbstractControl {
    return this.injuryForm.get('bodyPart');
  }

  get buildingNumber(): AbstractControl {
    return this.addressForm.get('buildingNumber');
  }

  get city(): AbstractControl {
    return this.addressForm.get('city');
  }

  get dayOfBirth(): AbstractControl {
    return this.patientForm.get('dayOfBirth');
  }

  get description(): AbstractControl {
    return this.injuryForm.get('slotDescription');
  }

  get duration(): AbstractControl {
    return this.operationForm.get('duration');
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

  get injury(): AbstractControl {
    return this.injuryForm.get('injury');
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

  get mpiId(): AbstractControl {
    return this.patientForm.get('mpiId');
  }

  get operation(): AbstractControl {
    return this.operationForm.get('operation');
  }

  get operationDetail(): AbstractControl {
    return this.operationForm.get('operationDetail');
  }

  get patientId(): AbstractControl {
    return this.patientForm.get('patientId');
  }

  get registrationBuildingNumber(): AbstractControl {
    return this.addressForm.get('registrationBuildingNumber');
  }

  get rehabilitation(): AbstractControl {
    return this.operationForm.get('rehabilitation');
  }

  get side(): AbstractControl {
    return this.injuryForm.get('side');
  }

  get street(): AbstractControl {
    return this.addressForm.get('street');
  }

  get telephone(): AbstractControl {
    return this.patientForm.get('telephone');
  }

  get zipCode(): AbstractControl {
    return this.addressForm.get('zipCode');
  }

  ngOnInit(): void {
    const workplaceId = this.data.slot?.workplaceId;
    if (workplaceId == 133) {
      this.sides = this.sides.filter(f => (f.value === 1 || f.value ===2));
    }
    this.bodyParts = this.store.selectSnapshot(AppState.bodyPart).filter(f => f.workplaceId === workplaceId);
    this.injuries = this.store.selectSnapshot(AppState.injury);
    this.insurances = this.store.selectSnapshot(AppState.insurance);
    this.operations = this.store.selectSnapshot(AppState.operation);

    this.edit = !!this.data.slot.patientId;
    this.createAddressForm();
    this.createInjuryForm();
    this.createOperationForm();
    this.createPatientForm();

    if (this.edit) {
      this.loading = true;

      const bodyPart = this.data.slot.bodyPart;
      this.filterInjuries(bodyPart);
      this.filterOperations(bodyPart);
      this.filterOperationDetails();

      this.patientService.getPatientById(this.data.slot.patientId).subscribe(data => {
        if (data) {
          this.updateAddressForm(data);
          this.updatePatientForm(data);
        }
        this.loading = false;
      });
    }
  }

  getColor(duration: number): ThemePalette {
    return this.duration.value === duration ? 'accent' : 'primary';
  }

  onChangeBodyPart(): void {
    this.injury.reset();
    this.operation.reset();
    const bodyPart = this.bodyPart.value;
    this.filterInjuries(bodyPart);
    this.filterOperations(bodyPart);
  }

  onChangeOperation(): void {
    this.operationDetail.reset();
    this.filterOperationDetails();
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

        if (patient.patientId === null) {
          this.parseInsuranceNumber(insuranceNumber);
        } else {
          this.updateAddressForm(patient);
          this.updatePatientForm(patient);
        }
        this.loading = false;
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
    if (this.gender.value === null) {
      const lastLetter = this.lastName.value.slice(-1).toLowerCase();
      this.gender.setValue(((lastLetter === 'a' || lastLetter === 'á') ? 2 : 1));
    }
    const operation = {...this.injuryForm.value, ...this.operationForm.value,
      rehabilitation: this.rehabilitation.value ? (this.rehabilitation.value ? 1 : 0) : 0};
    const patient = {...this.addressForm.value, ...this.patientForm.value}
    const formData = {operation: operation, patient: patient, description: this.description.value};
    this.dialogRef.close({event: this.edit ? ModalEventEnum.Edit : ModalEventEnum.Create, data: formData});
  }

  setDuration(duration: number): void {
    this.duration.setValue(duration);
  }

  private capitalizeFirstLetter(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  private createAddressForm(): void {
    this.addressForm = this.fb.group({
      street: [null, Validators.required],
      buildingNumber: [null],
      registrationBuildingNumber: [null, Validators.required],
      city: [null, Validators.required],
      zipCode: [null, Validators.required]
    });
  }

  private createInjuryForm(): void {
    const edit = this.edit;
    const data = this.data.slot;
    this.injuryForm = this.fb.group({
      side: [edit ? data.side : null, Validators.required],
      bodyPart: [edit ? data.bodyPart : null, Validators.required],
      injury: [edit ? data.injury : null, Validators.required],
      injuryDescription: [edit ? data.injuryDescription : null],
      slotDescription: [edit ? data.description : null]
    });
  }

  private createOperationForm(): void {
    const edit = this.edit;
    const data = this.data.slot;
    this.operationForm = this.fb.group({
      operation: [edit ? data.operation : null, Validators.required],
      operationDetail: [edit ? data.operationDetail : null],
      operationDescription: [edit ? data.operationDescription : null],
      rehabilitation: [edit ? data.rehabilitation : null],
      duration: [edit ? data.duration : null, Validators.required]
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
      telephone: [null, Validators.required],
      email: [null, Validators.pattern(this.EMAIL_REGEX)],
      patientId: [null],
      mpiId: [null]
    });
  }

  private inverseCaps(value: string): string {
    return (value === value.toUpperCase()) ? value.toLowerCase() : value;
  }

  private filterInjuries(bodyPart: number): void {
    this.filteredInjuries = this.injuries.filter(f => f.bodyPart === bodyPart);
  }

  private filterOperations(bodyPart: number): void {
    this.filteredOperations = [];
    this.operations.filter(f => f.bodyPart === bodyPart).map(o => {
      if (this.filteredOperations.filter(f => f.operation === o.operation).length === 0) {
        this.filteredOperations.push(o);
      }
    });
  }

  private filterOperationDetails(): void {
    this.operationDetails = this.operations.filter(f => f.operation === this.operation.value && f.operationDetail !== null);
  }

  private parseInsuranceNumber(insuranceNumber: string): void {
    const yearYY = +insuranceNumber.substring(0, 2);
    const monthMM = +insuranceNumber.substring(2, 4);
    const day = +insuranceNumber.substring(4, 6);
    const year = (insuranceNumber.length === 10 && yearYY < 54) ? (yearYY + 2000) : (yearYY + 1900);
    const month = (monthMM < 50) ? monthMM : (monthMM - 50);

    if (day > 0 && day < 32 && month > 0 && month < 13 && year > 1899 && year < 2100) {
      this.dayOfBirth.setValue(`${year}-${month}-${day}`);
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

  private updateAddressForm(patient: PatientDataModel): void {
    this.street.setValue(patient.street);
    this.buildingNumber.setValue(patient.buildingNumber);
    this.registrationBuildingNumber.setValue(patient.registrationBuildingNumber);
    this.city.setValue(patient.city, {emitEvent: false});
    this.zipCode.setValue(patient.zipCode);
  }

  private updatePatientForm(patient: PatientDataModel): void {
    this.insuranceNumber.setValue(patient.insuranceNumber);
    this.firstName.setValue(patient.firstName);
    this.lastName.setValue(patient.lastName);
    this.insuranceId.setValue(patient.insuranceId);
    this.telephone.setValue(patient.telephone);
    this.email.setValue(patient.email);
    this.gender.setValue(patient.gender);
    this.dayOfBirth.setValue(patient.dayOfBirth);
    this.patientId.setValue(patient.patientId);
    this.mpiId.setValue(patient.mpiId);
  }
}
