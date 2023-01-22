import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'timeFormat'})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string, args?: any): any {
    if (value !== null) {
      const position = value.search(':');
      return value.slice(0, position + 3);
    }
    return null;
  }
}
