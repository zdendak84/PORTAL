import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-user-input',
  templateUrl: './filter-userInput.component.html',
  styleUrls: ['./filter-userInput.component.css']
})
export class FilterUserInputComponent implements OnInit {
  @Input() enabled: boolean;
  @Output() readonly valueChange = new EventEmitter();

  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder) {}

  get search(): AbstractControl {
    return this.searchForm.get('search');
  }

  ngOnInit(): void {
    this.createSearchForm();
  }

  cleanSearchInput(): void {
    this.search.setValue('');
    this.onChange();
  }

  onChange(): void {
    if (this.enabled) {
      this.valueChange.emit(this.search.value);
    }
  }

  private createSearchForm(): void {
    this.searchForm = this.fb.group({
      search: [null]
    });
  }
}
