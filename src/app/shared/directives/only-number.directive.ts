import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appNumberOnly]'
})
export class OnlyNumberDirective implements OnInit {
  inputElement: HTMLElement;

  @Input()
  onlyNumberLength: number;

  private regex: RegExp;
  private navigationKeys = [
    'Backspace',
    'Delete',
    'Tab',
    'Escape',
    'Enter',
    'Home',
    'End',
    'ArrowLeft',
    'ArrowRight',
    'Clear',
    'Copy',
    'Paste'
  ];
  constructor(public el: ElementRef) {
    this.inputElement = el.nativeElement;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent): void {
    if (
      this.navigationKeys.indexOf(e.key) > -1 ||
    (e.key === 'a' && e.ctrlKey === true) ||
    (e.key === 'c' && e.ctrlKey === true) ||
    (e.key === 'v' && e.ctrlKey === true) ||
    (e.key === 'x' && e.ctrlKey === true)
  ) {
      // let it happen, don't do anything
      return;
    }
    // Ensure that it is a number and stop the keypress
    if (e.key === ' ' || isNaN(Number(e.key))) {
      e.preventDefault();
    } else {
      const current: string = this.el.nativeElement.value;
      const positionStart: number = this.el.nativeElement.selectionStart;
      let positionEnd: number = this.el.nativeElement.selectionEnd;

      if (this.onlyNumberLength > 0 && current.length === this.onlyNumberLength) {
        if (positionStart === positionEnd) {
          positionEnd = positionEnd + 1;
          this.el.nativeElement.setSelectionRange(positionStart, positionEnd);
        }
      }
      const next: string = [current.slice(0, positionStart), e.key, current.slice(positionEnd)].join('');
      if (next && !String(next).match(this.regex)) {
        e.preventDefault();
      }
    }
  }
  @HostListener('keypress', ['$event'])
  onKeyUp(e: KeyboardEvent): void {
    if (e.key === ' ' || isNaN(Number(e.key))) {
      e.preventDefault();
    }
  }
  @HostListener('paste', ['$event'])
  onPaste(event: any): void {
    event.preventDefault();
    const isIe: boolean = !event.clipboardData;
    const pastedInput: string = isIe
      ? (window as any).clipboardData.getData('text')
      : event.clipboardData.getData('text/plain');
    if (pastedInput.length > 6) {
      event.preventDefault();
    } else {
      document.execCommand(
        isIe ? 'paste' : 'insertText',
        false,
        pastedInput.replace(/[^0-9.]/g, '')
      );
    }
  }

  ngOnInit(): void {
    if (this.onlyNumberLength !== undefined) {
      this.regex = new RegExp(`^[0-9]{1,${this.onlyNumberLength}}$`);
    } else {
      this.regex = new RegExp('^[0-9]+$');
    }
  }
}
