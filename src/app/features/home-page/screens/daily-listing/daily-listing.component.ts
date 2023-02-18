import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppState } from "@store/app.state";
import { SIDE } from "@shared/constants/dropdown.constants";
import { ColumnData } from "@shared/model/column-data-model";
import { Component, OnInit, ViewChild } from '@angular/core';
import { DescriptionModalComponent } from "@shared/components/description-modal/description-modal.component";
import { DESKTOP_COLUMNS, MOBILE_COLUMNS } from './daily-column.constants';
import { DeviceUtils } from "@shared/utils/device-utils";
import { DiacriticsService } from '@services/utility/diacritics.service';
import { ExaminationDataModel } from "@shared/model/backend-api/examinationDataModel";
import { ExcelService } from "@services/utility/excel.service";
import { ListingDataModel } from '@shared/model/backend-api/listingDataModel';
import { ListingFilterModel } from "@shared/model/filters/listingFilterModel";
import { ListingService } from '@services/backend-api/listing/listing.service';
import { ListingUtils } from '@shared/utils/listing-utils';
import { LocationDataModel } from "@shared/model/backend-api/locationDataModel";
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalEventEnum } from "@shared/model/enums/modalEventEnum";
import { SetListingFilter } from '@store/app.actions';
import { SlotActionEnum } from '@shared/model/enums/slotActionEnum';
import { SlotHistoryModalComponent } from "../../components/slot-history-modal/slot-history-modal.component";
import { SlotPreviewModalComponent } from "../../components/slot-preview-modal/slot-preview-modal.component";
import { SlotReservationModalComponent } from "../../components/slot-reservation-modal/slot-reservation-modal.component";
import { SlotService } from "@services/backend-api/slot/slot.service";
import { SnackbarService } from '@services/utility/snackbar.service';
import { Store } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { WorkplaceDataModel } from "@shared/model/backend-api/workplaceDataModel";
import { YesNoModalComponent } from "@shared/components/yes-no-modal/yes-no-modal.component";
import moment from "moment";
import { OPERATION_COLUMNS_PDF } from "./operation-column-pdf.constants";
import { ListingPrintPDF } from "../../components/listing-print-PDF/listing-print-PDF";
import { BodyPartCodebook } from "@shared/model/backend-api/codebooks/bodyPartCodebook";

@UntilDestroy()
@Component({
  selector: 'app-daily-listing',
  templateUrl: './daily-listing.component.html',
  styleUrls: ['./daily-listing.component.css']
})
export class DailyListingComponent implements OnInit {
  readonly action = SlotActionEnum;
  readonly fieldRequired = 'Toto pole je povinné';
  readonly sides = SIDE;
  readonly operationColumn = OPERATION_COLUMNS_PDF;
  bodyParts: BodyPartCodebook[];
  dataSource: MatTableDataSource<ListingDataModel>;
  examinations: ExaminationDataModel[];
  filter: ListingFilterModel;
  loading: boolean;
  locations: LocationDataModel[];
  relevant = false;
  searchForm: FormGroup;
  workplaces: WorkplaceDataModel[];
  private paginator: MatPaginator;
  private sort: MatSort;

  constructor(
    public device: DeviceUtils,
    public utils: ListingUtils,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private fb: FormBuilder,
    private listingService: ListingService,
    private listingPrintPDF: ListingPrintPDF,
    private slotService: SlotService,
    private snackbarService: SnackbarService,
    private store: Store) {}

  @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator, { static: false }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  get columnData(): ColumnData[] {
    return this.isDesktop ? DESKTOP_COLUMNS : MOBILE_COLUMNS;
  }

  get dateFrom(): AbstractControl {
    return this.searchForm.get('dateFrom');
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
    this.dataSource = new MatTableDataSource<ListingDataModel>([]);
    this.bodyParts = this.store.selectSnapshot(AppState.bodyPart);
    this.filter = this.store.selectSnapshot(AppState.listingFilter);
    this.examinations = this.store.selectSnapshot(AppState.examinations);
    this.locations = this.store.selectSnapshot(AppState.locations);
    this.workplaces = this.store.selectSnapshot(AppState.workplaces);
    this.createSearchForm();
    this.onChange();
  }

  doFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportAsExcelFile(): void {
    let data: { casOd: string, casDo: string, pacient: string, rokNarozeni: number, telefon: string, cisloPojistence: number,
      pojistovna: number, castTela: string, strana: string, diagnoza: string, diagnozaPopis: string, operace: string,
      operaceDetail: string, operacePoznamka: string, doba: number, rehabilitace: string, poznamka: string }[] = [];
    this.dataSource.data.filter(f => f.patientId !== null).map(d => {
      data.push({ casOd: d.timeFrom, casDo: d.timeTo, pacient: `${d.lastName ? d.lastName : ''} ${d.firstName ? d.firstName : ''}`,
        rokNarozeni: d.yearOfBirth, telefon: d.telephone, cisloPojistence: d.insuranceNumber, pojistovna: d.insuranceId,
        castTela: d.bodyPartText, strana: d.sideText, diagnoza: d.injury, diagnozaPopis: d.injuryDescription,
        operace: d.operationWorkplace ? d.operation : this.getExaminationName(d.examinationId),
        operaceDetail: d.operationDetail, operacePoznamka: d.operationDescription, doba: d.duration,
        rehabilitace: d.operationWorkplace ? (d.rehabilitation ? 'ano' : 'ne') : '', poznamka: d.description })
    });
    this.excelService.exportAsExcelFile(data, this.dateFrom.value.format('YYYYMMDD').toString());
  }

  getExaminationName(examinationId: number): string {
    const examination = this.examinations.find(f => f.examinationId === examinationId);
    return examination ? `${examination.name} (${examination.duration})` : '';
  }

  getPlanDate(shift: number): void {
    this.loading = true;
    const filter = {dateFrom: this.dateFrom.value, workplaceId: this.filter.workplaceId, shift: shift}
      this.listingService.getPlanDate(filter).subscribe( data => {
        if (data) {
          this.dateFrom.setValue(moment(data.date));
          this.onChange();
        } else {
          this.loading = false;
        }
      });
  }

  onChange(): void {
    this.filter = {...this.filter, dateFrom: this.dateFrom.value };
    this.store.dispatch(new SetListingFilter(this.filter));
    if (this.filter.locationId && this.filter.workplaceId && this.filter.dateFrom) {
      this.getListing();
    }
  }

  printPdf(): void {
    const list = this.operationColumn.slice();

    this.dataSource.filteredData.filter(f => f.type === 2).map(o => {
      list.push([{ text: `${o.insuranceId}`, fontSize: 9 },
        { text: `${o.lastName} ${o.firstName} (${o.insuranceNumber})\n tel.: ${o.telephone === null ? '' : o.telephone}\n ${o.description === null ? '' : o.description}`, fontSize: 9 },
        { text: `${o.injury} ${o.bodyPartText} ${o.sideText} ${o.injuryDescription === null ? '' : o.injuryDescription}\n${o.operation} ${o.sideText} ${o.operationDetail === null ? '' : o.operationDetail}\n${o.operationDescription === null ? '' : o.operationDescription}`, fontSize: 9 },
        { text: (o.rehabilitation ? '*' : ''), fontSize: 9}]);
    });

    this.listingPrintPDF.printPDF(list, [ 25, 145, '*', 5 ], '', this.filter.dateFrom.format('DD.MM.YYYY').toString());
  }

  slotAction(slot: ListingDataModel, action: SlotActionEnum): void {
    switch (action) {
      case SlotActionEnum.cancel:
        this.cancelOrder(slot);
        return;
      case SlotActionEnum.description:
        this.describeOrder(slot);
        return;
      case SlotActionEnum.edit:
        this.slotReservation(slot);
        return;
      case SlotActionEnum.history:
        this.showHistory(slot);
        return;
      case SlotActionEnum.preview:
        this.slotPreview(slot);
        return;
      case SlotActionEnum.reservation:
        this.slotReservation(slot);
        return;
      case SlotActionEnum.shiftDown:
        this.swapOrders(slot.slotId, slot.nextOrderSlotId);
        return;
      case SlotActionEnum.shiftUp:
        this.swapOrders(slot.previousOrderSlotId, slot.slotId);
        return;
      default:
        return;
    }
  }

  private createSearchForm(): void {
    this.searchForm = this.fb.group({
      dateFrom: [this.filter?.dateFrom ? this.filter.dateFrom : null, Validators.required]
    });
  }

  /* zruseni objednavky */
  private cancelOrder(slot: ListingDataModel): void {
    let dialog;
    dialog = this.dialog.open(YesNoModalComponent, {
      disableClose: true,
      width: this.dialogWidth,
      data: {
        body: `${slot.firstName ? slot.firstName : ''} ${slot.lastName ? slot.lastName : ''}`,
        header: 'Opravdu chcete zrušit termín?'}
    });
    dialog.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result.result) {
        this.slotService.cancelOrder(slot.slotId).subscribe(data => {
          if (data?.result === 1) {
            this.getListing();
          } else {
            this.snackbarService.openErrorSnackBar('Objednávku se nepodařilo zrušit');
          }
        });
      }
    });
  }

  /* zapis poznamky */
  private describeOrder(slot: ListingDataModel): void {
    let dialog;
    dialog = this.dialog.open(DescriptionModalComponent, {
      disableClose: true,
      width: this.dialogWidth,
      data: {body: slot.description,
        header: `${slot.firstName ? slot.firstName : ''} ${slot.lastName ? slot.lastName : ''}`}
    });
    dialog.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result.event === ModalEventEnum.Edit) {
        this.slotService.updateOrderDescription(slot.slotId, result.data).subscribe(data => {
          if (data) {
            this.getListing();
          } else {
            this.snackbarService.openErrorSnackBar('Poznámku se nepodařilo nastavit');
          }
        });
      }
    });
  }

  /* presun */
  private swapOrders(firstSlotId: number, secondSlotId: number): void {
    this.slotService.swapOrders(firstSlotId, secondSlotId).subscribe(data => {
      if (data) {
        this.getListing();
      } else {
        this.snackbarService.openErrorSnackBar('Objednávku se nepodařilo přesunout');
      }
    });
  }

  /* zobrazeni nahledu */
  private slotPreview(slot: ListingDataModel): void {
    let dialog;
    dialog = this.dialog.open(SlotPreviewModalComponent, {
      width: this.dialogWidth, data: { slot: slot }
    });
    dialog.afterClosed().pipe(untilDestroyed(this)).subscribe();
  }

  /* rezervace terminu */
  private slotReservation(slot: ListingDataModel): void {
    let freeTime = 0
    if (slot.patientId) {
      this.dataSource.data.filter(f => f.timeFrom > slot.timeFrom && f.type === 1).map(m => {
        freeTime = freeTime + m.duration;
      });
    }
    const minDuration = this.examinations.find(f => f.examinationId === slot.examinationId).duration;
    const maxDuration = slot.patientId ? freeTime + slot.duration : slot.duration;
    let dialog;
    dialog = this.dialog.open(SlotReservationModalComponent, {
      disableClose: true,
      width: this.dialogWidth, data: { slot, minDuration, maxDuration }
    });
    dialog.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result.event === ModalEventEnum.Edit) {
        this.slotService.updateOperation(slot.slotId, result.data.patient, result.data.operation, result.data.description).subscribe(data => {
          if (data) {
            this.getListing();
          } else {
            this.snackbarService.openErrorSnackBar('Objednávku se nepodařilo upravit');
          }
        });
      }
      if (result.event === ModalEventEnum.Create) {
        this.slotService.reserveOperation(slot.slotId, result.data.patient, result.data.operation, result.data.description).subscribe(data => {
          if (data) {
            this.getListing();
          } else {
            this.snackbarService.openErrorSnackBar('Objednávku se nepodařilo vytvořit');
          }
        });
      }
    });
  }

  /* zobrazeni historie */
  private showHistory(slot: ListingDataModel): void {
    let dialog;
    dialog = this.dialog.open(SlotHistoryModalComponent, {
      width: this.dialogWidth, data: { slotId: slot.slotId, patientId: slot.patientId }
    });
    dialog.afterClosed().pipe(untilDestroyed(this)).subscribe();
  }

  private getListing(): void {
    const filter = {...this.filter, dateFrom: this.dateFrom.value};

    this.loading = true;
    this.listingService.getListingByFilter(filter).subscribe(data => {
      if (data) {
        this.relevant = data.filter(f => f.relevant).length > 0;
        data.map(d => {
          d.previousOrderSlotId = data.find(f => f.patientId !== null && f.timeTo === d.timeFrom)?.slotId;
          d.nextOrderSlotId = data.find(f => f.patientId !== null && f.timeFrom === d.timeTo)?.slotId;
          d.sideText = d.side ? this.sides.find(f => f.value === d.side).name : null;
          d.bodyPartText = d.bodyPart ? this.bodyParts.find(f => f.bodyPart === d.bodyPart).bodyPartName : null;
        });
        this.dataSource.data = data;
        this.setDataSourceAttributes();
      } else {
        this.dataSource.data = null;
        this.snackbarService.openInfoSnackBar('Žádné záznamy k zobrazení');
      }
      this.loading = false;
    })
  }

  private setDataSourceAttributes(): void {
    if (this.dataSource?.data) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = this.sortingDataAccessor.bind(this);
    }
  }

  private sortingDataAccessor(sortItem: ListingDataModel, property: string): string | number {
    switch (property) {
      case 'time':
        return sortItem.timeFrom;
      case 'patient':
        return DiacriticsService.removeDiacritics(sortItem.lastName);
      default:
        return sortItem[property];
    }
  }
}
