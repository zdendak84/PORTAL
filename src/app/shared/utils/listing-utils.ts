import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class ListingUtils {

  getDescription(description: string, len: number): string {
    if (description) {
      return description.substr(0, ((description.length > len) ? len : description.length));
    }
    return '';
  }

  getDescriptionFull(description: string, len: number): boolean {
    if (description) {
      return (description.length > len);
    }
    return false;
  }
}
