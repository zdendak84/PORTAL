import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-yes-no-modal',
    templateUrl: './yes-no-modal.component.html',
    styleUrls: ['./yes-no-modal.component.css'],
    standalone: false
})
export class YesNoModalComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<YesNoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {body: string; header: string}
  ) {}

  ngOnInit(): void { }

  onNoClick(): void {
    this.dialogRef.close({result: false});
  }

  onYesClick(): void {
    this.dialogRef.close({result: true});
  }
}
