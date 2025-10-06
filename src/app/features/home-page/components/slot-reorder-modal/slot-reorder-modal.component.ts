import { FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ModalEventEnum } from '@shared/model/enums/modalEventEnum';
import { ReorderAlternativeDataModel } from "@shared/model/backend-api/reorderAlternativeDataModel";
import { SlotService } from "@services/backend-api/slot/slot.service";

@Component({
    selector: 'app-slot-reorder-modal-component',
    templateUrl: './slot-reorder-modal.component.html',
    styleUrls: ['./slot-reorder-modal.component.css'],
    standalone: false
})
export class SlotReorderModalComponent implements OnInit {
  readonly fieldRequired = 'Toto pole je povinné';
  edit = false;
  loading = false;
  reorderAlternatives: ReorderAlternativeDataModel[];
  reorderForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private slotService: SlotService,
    public dialogRef: MatDialogRef<SlotReorderModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { slotId: number }
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.slotService.getReorderAlternatives(this.data.slotId).subscribe(data => {
      if (data) {
        this.reorderAlternatives = data;
      }
      this.loading = false;
      this.createReorderForm();
    });
  }

  onNoClick(): void {
    this.dialogRef.close({event: ModalEventEnum.Cancel});
  }

  onSubmit(): void {
    if (this.reorderForm.invalid) {
      return;
    }
    const formData = {...this.reorderForm.value};
    this.dialogRef.close({event: ModalEventEnum.Create, data: formData});
  }

  private createReorderForm(): void {
    this.reorderForm = this.fb.group({
      slotId: [null, Validators.required]
    });
  }
}
