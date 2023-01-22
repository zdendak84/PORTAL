import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalEventEnum } from '@shared/model/enums/modalEventEnum';
import { SlotHistoryDataModel } from '@shared/model/backend-api/slotHistoryDataModel';
import { SlotService } from '@services/backend-api/slot/slot.service';

@Component({
  selector: 'app-slot-history-modal-component',
  templateUrl: './slot-history-modal.component.html',
  styleUrls: ['./slot-history-modal.component.css']
})
export class SlotHistoryModalComponent implements OnInit {
  loading = true;
  slotHistory: SlotHistoryDataModel[];
  constructor(
    private slotService: SlotService,
    public dialogRef: MatDialogRef<SlotHistoryModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {slotId: number; patientId: number}
  ) {}

  ngOnInit(): void {
    this.slotService.getSlotHistoryById(this.data.slotId, this.data.patientId).subscribe(data => {
      this.slotHistory = (data !== null) ? data : null;
      this.loading = false;
    });
  }

  onNoClick(): void {
    this.dialogRef.close({event: ModalEventEnum.Cancel});
  }

  getActionDetail(action: number, color: boolean): string {
    switch (action) {
      case 0:
        return color ? '#ffffff' : 'zrušení rezervace';
      case 1:
        return color ? '#ffffff' : 'rezervace';
      case 10:
        return color ? '#ff0000' : 'zrušení objednávky';
      case 11:
        return color ? '#33cc33' : 'potvrzení objednávky';
      case 20:
        return color ? '#ffffff' : 'výmaz poznámky';
      case 21:
        return color ? '#ffffff' : 'vložení poznámky';
      case 22:
        return color ? '#ffffff' : 'změna poznámky';
      case 31:
        return color ? '#ffffff' : 'příchod na recepci';
      default:
        return color ? '#ffffff' : 'neznámá akce';
    }
  }
}
