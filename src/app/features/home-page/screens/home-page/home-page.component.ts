import { AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import { AppState } from "@store/app.state";
import { Component, OnInit } from '@angular/core';
import { DeviceUtils } from "@shared/utils/device-utils";
import { ExcelService } from "@services/utility/excel.service";
import { ListingFilterModel } from "@shared/model/filters/listingFilterModel";
import { ListingService } from "@services/backend-api/listing/listing.service";
import { LocationDataModel } from "@shared/model/backend-api/locationDataModel";
import { Navigate } from "@ngxs/router-plugin";
import { Observable} from "rxjs";
import { Select, Store} from "@ngxs/store";
import { SetListingFilter } from "@store/app.actions";
import { SnackbarService } from "@services/utility/snackbar.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { WorkplaceDataModel } from "@shared/model/backend-api/workplaceDataModel";
import moment from "moment";
import {formatDate} from "@angular/common";

@UntilDestroy()
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})

export class HomePageComponent implements OnInit {
  @Select(AppState.listingFilter) filter$: Observable<ListingFilterModel>;
  readonly fieldRequired = 'Toto pole je povinné';
  filter: ListingFilterModel;
  loading: boolean;
  locations: LocationDataModel[];
  workplaces: WorkplaceDataModel[];
  searchForm: FormGroup;

  constructor(
    public device: DeviceUtils,
    private excelService: ExcelService,
    private fb: FormBuilder,
    private listingService: ListingService,
    private snackbarService: SnackbarService,
    private store: Store) {}

  get filteredWorkplaces(): WorkplaceDataModel[] {
    return this.locationId.value ? this.workplaces.filter(f => f.locationId === this.locationId.value) : null;
  }

  get dateFrom(): AbstractControl {
    return this.searchForm.get('dateFrom');
  }

  get dateTo(): AbstractControl {
    return this.searchForm.get('dateTo');
  }

  get instruction(): string {
    if (this.workplaceId.value) {
      return this.workplaces.find(f => f.workplaceId === this.workplaceId.value).instruction;
    }
    return null;
  }

  get isValid(): boolean {
    return (this.locationId.value && this.workplaceId.value);
  }

  get locationId(): AbstractControl {
    return this.searchForm.get('locationId');
  }

  get workplaceId(): AbstractControl {
    return this.searchForm.get('workplaceId');
  }

  ngOnInit(): void {
    this.loading = true;
    this.filter$.pipe(untilDestroyed(this)).subscribe(filter => {
      if (filter) {
        this.locations = this.store.selectSnapshot(AppState.locations);
        this.workplaces = this.store.selectSnapshot(AppState.workplaces);
        this.filter = filter;
        this.createSearchForm();
        if (filter.dateFrom === null) {
          this.getNextPlanDate();
        }
        this.loading = false;
      }
    });
  }

  exportAsExcelFile(): void {
    const bodyParts = this.store.selectSnapshot(AppState.bodyPart);
    const bodySides = this.store.selectSnapshot(AppState.bodySide);
    let exportData: { datum: string, casOd: string, casDo: string, pacient: string, rokNarozeni: number, telefon: string,
      castTela: string, strana: string, diagnoza: string, diagnozaPopis: string, operace: string,
      operaceDetail: string, operacePoznamka: string, doba: number, rehabilitace: string, poznamka: string }[] = [];

    const filter = {locationId: this.locationId.value, workplaceId: this.workplaceId.value,
      dateFrom: this.dateFrom.value, dateTo: this.dateTo.value};

    this.loading = true;
    this.listingService.getListingByFilter(filter).subscribe(data => {
      if (data) {
        data.filter(f => f.patientId !== null).map(d => {
          exportData.push({ datum: formatDate(d.date, 'dd.MM.yyyy', 'en-US'), casOd: d.timeFrom, casDo: d.timeTo,
            pacient: `${d.lastName ? d.lastName : ''} ${d.firstName ? d.firstName : ''}`, rokNarozeni: d.yearOfBirth, telefon: d.telephone,
            castTela: d.bodyPart ? bodyParts.find(f => f.bodyPart === d.bodyPart).bodyPartName : '',
            strana: d.side ? bodySides.find(f => f.bodySide === d.side).bodySideName : '', diagnoza: d.injury, diagnozaPopis: d.injuryDescription,
            operace: d.operation, operaceDetail: d.operationDetail, operacePoznamka: d.operationDescription, doba: d.duration,
            rehabilitace: d.operationWorkplace ? (d.rehabilitation ? 'ano' : 'ne') : '', poznamka: d.description })
        });
        this.excelService.exportAsExcelFile(exportData, `${filter.dateFrom.format('YYYYMMDD').toString()}_${filter.dateTo.format('YYYYMMDD').toString()}`);
      } else {
        this.snackbarService.openInfoSnackBar('Žádné záznamy k exportu');
      }
    });
    this.loading = false;
  }

  getNextPlanDate(): void {
    if (this.isValid) {
      this.loading = true;
      const filter = {dateFrom: moment(), workplaceId: this.workplaceId.value, shift: 0}
      this.listingService.getPlanDate(filter).subscribe( data => {
        this.filter = {dateFrom: (data ? moment(data.date) : moment()), locationId: this.locationId.value, workplaceId: this.workplaceId.value}
        this.store.dispatch(new SetListingFilter(this.filter));
        this.loading = false;
      });
    }
  }

  onLocationChange(): void {
    if (this.filteredWorkplaces.length === 1) {
      this.workplaceId.setValue(this.filteredWorkplaces[0].workplaceId);
    }
    this.getNextPlanDate();
  }

  onWorkplaceChange(): void {
    this.getNextPlanDate();
  }

  setPeriod(diff: number): void {
    const date = (diff === 0) ? moment() : moment().add(diff, 'months');
    this.dateFrom.setValue(moment(date.startOf('month').format('YYYY-MM-DD')));
    this.dateTo.setValue(moment(date.endOf('month').format('YYYY-MM-DD')));
  }

  toListing(): void {
    this.store.dispatch(new Navigate(['/listing']));
  }

  toSchedule(): void {
    this.store.dispatch(new Navigate(['/schedule']));
  }

  private createSearchForm(): void {
    this.searchForm = this.fb.group({
      locationId: [this.filter?.locationId ? this.filter.locationId : null, Validators.required],
      workplaceId: [this.filter?.workplaceId ? this.filter.workplaceId : null, Validators.required],
      dateFrom: [null],
      dateTo: [null],
    });
  }
}
