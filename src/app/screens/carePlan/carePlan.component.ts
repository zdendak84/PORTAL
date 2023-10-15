import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DeviceUtils } from "@shared/utils/device-utils";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CarePlanView } from "@shared/model/backend-api/carePlanView";
import moment from "moment";
import { ListingService } from "@services/backend-api/listing/listing.service";
import { ActivatedRoute } from "@angular/router";
import { SnackbarService } from "@services/utility/snackbar.service";
import { forkJoin } from "rxjs";
import { CarePlanInfo } from "@shared/model/backend-api/carePlanInfo";

@Component({
  selector: 'app-care-plan',
  templateUrl: './carePlan.component.html',
  styleUrls: ['./carePlan.component.css']
})
export class CarePlanComponent implements OnInit {
  readonly fieldRequired = 'Toto pole je povinné';
  carePlanInfo: CarePlanInfo[];
  code: string;
  dataSource = new MatTableDataSource<CarePlanView>([]);
  loading: boolean;
  searchForm: FormGroup;

  constructor(
    public device: DeviceUtils,
    private fb: FormBuilder,
    private listingService: ListingService,
    private route: ActivatedRoute,
    private snackbarService: SnackbarService) {}

  @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
    this.dataSource.sort = ms;
  }
  @ViewChild(MatPaginator, { static: false }) set matPaginator(mp: MatPaginator) {
    this.dataSource.paginator = mp;
  }

  get dateFrom(): AbstractControl {
    return this.searchForm.get('dateFrom');
  }

  get displayedColumns(): string[] {
    return this.isDesktop ?
        ['timeFrom', 'timeTo', 'examinationName', 'doctorName', 'locationName', 'buildingName', 'roomFloor', 'roomNumber'] :
        ['time', 'examination'];
  }

  get pageSize(): number {
    return this.isDesktop ? 15 : 10;
  }

  get isDesktop(): Boolean {
    return this.device.isDesktop;
  }

  get isDayBefore(): Boolean {
    return moment().diff(this.dateFrom.value, 'hour') < 0;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(m => {
      this.code = m.get('code');
    });
    this.createSearchForm();
    this.getListing();
  }

  /*posun datumu o zvoleny pocet dni*/
  addDays(diff: number): void {
    let date = moment(this.dateFrom.value);
    date = date.add(diff, 'days');
    if (diff === 0) {
      date = moment();
    }
    this.dateFrom.setValue(date);
    this.getListing();
  }

  onChange(): void {
    this.getListing();
  }

  private getListing(): void {
    this.loading = true;
    const filter = {dateFrom: this.dateFrom.value, code: this.code};
    const carePlan$ = this.listingService.getCarePlan(filter);
    const carePlanInfo$ = this.listingService.getCarePlanInfo(filter);
    forkJoin([carePlan$, carePlanInfo$]).subscribe(data => {
      this.dataSource.data = data[0] ? data[0] : [];
      this.carePlanInfo = data[1];
      if (!data[0]) {
        this.snackbarService.openInfoSnackBar('Žádné záznamy k zobrazení');
      }
      this.loading = false;
    })
  }

  private createSearchForm(): void {
    this.searchForm = this.fb.group({
      dateFrom: [moment(), Validators.required]
    });
  }
}
