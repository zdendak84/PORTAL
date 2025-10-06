import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ListingDataModel } from "@shared/model/backend-api/listingDataModel";
import { ModalEventEnum } from '@shared/model/enums/modalEventEnum';

@Component({
    selector: 'app-slot-preview-modal-component',
    templateUrl: './slot-preview-modal.component.html',
    styleUrls: ['./slot-preview-modal.component.css'],
    standalone: false
})
export class SlotPreviewModalComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<SlotPreviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {slot: ListingDataModel}
  ) {}

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close({event: ModalEventEnum.Cancel});
  }
}
