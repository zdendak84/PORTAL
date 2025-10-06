import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'status',
    standalone: false
})
export class StatusPipe implements PipeTransform {
  transform(value): string {
    return value ? 'Aktivní' : 'Neaktivní';
  }
}

