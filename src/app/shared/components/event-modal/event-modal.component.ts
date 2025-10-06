import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ModalEventEnum } from '@shared/model/enums/modalEventEnum';
import { MatTableDataSource } from "@angular/material/table";
import { EventDataModel } from "@shared/model/backend-api/system/eventDataModel";
import { EventFilterDataModel } from "@shared/model/backend-api/system/eventFilterDataModel";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { DiacriticsService } from "@services/utility/diacritics.service";

@Component({
    selector: 'app-event-modal-component',
    templateUrl: './event-modal.component.html',
    styleUrls: ['./event-modal.component.css'],
    standalone: false
})
export class EventModalComponent implements OnInit {
  loading: boolean;

  dataSource: MatTableDataSource<EventDataModel>;
  displayedColumns: string[] = ['severity', 'createdAt', 'eventName', 'description',
    'userName', 'stationHostname', 'terminalSrvHostname', 'printerName'];
  private paginator: MatPaginator;
  private sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<EventModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data:
      {eventFilter: EventFilterDataModel}
  ) {}
  @ViewChild(MatSort, { static: false }) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  @ViewChild(MatPaginator, { static: false }) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<EventDataModel>(null);
    this.loadData();
  }

  setDataSourceAttributes(): void {
    if (this.dataSource && this.dataSource.data) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.sortingDataAccessor = this.sortingDataAccessor.bind(this);
    }
  }

  sortingDataAccessor(sortItem: EventDataModel, property: string): string | number {
    return DiacriticsService.removeDiacritics(sortItem[property]);
  }

  onCloseClick(): void {
    this.dialogRef.close({event: ModalEventEnum.Cancel});
  }

  getColor(severity: number): string {
    if (severity > 99) { return '#ff0000'; }
    if (severity > 9) { return '#ffff00'; }
    return '#00ff00';
  }

  private loadData(): void {
    this.loading = true;
    this.loading = false;
  }
}
