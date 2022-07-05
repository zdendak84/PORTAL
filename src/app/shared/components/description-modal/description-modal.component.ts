import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ModalEventEnum } from '@shared/model/enums/modalEventEnum';

@Component({
  selector: 'app-description-modal-component',
  templateUrl: './description-modal.component.html',
  styleUrls: ['./description-modal.component.css']
})
export class DescriptionModalComponent implements OnInit {
  descriptionForm: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DescriptionModalComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: {body: string; header: string}
  ) {}

  ngOnInit(): void {
    this.createDescriptionForm();
  }

  onNoClick(): void {
    this.dialogRef.close({event: ModalEventEnum.Cancel});
  }

  onSubmit(): void {
    const descValue = this.descriptionForm.get('description').value === '' ? null : this.descriptionForm.get('description').value;
    this.dialogRef.close({event: ModalEventEnum.Edit, data: descValue});
  }

  protected createDescriptionForm(): void {
    this.descriptionForm = this.fb.group({
      description: [this.data.body]
    });
  }
}
