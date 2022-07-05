import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DiacriticsService {

  static removeDiacritics(searchString: string): string {
    if (!searchString || !(typeof searchString === 'string' || typeof searchString === 'object')) {
      return searchString;
    }

    const diacritics: {pattern: string, replacement: string }[] = [
      {pattern: '[àáâãäå]', replacement: 'a'},
      {pattern: 'æ', replacement: 'ae'},
      {pattern: '[çč]', replacement: 'c'},
      {pattern: '[ď]', replacement: 'd'},
      {pattern: '[èéêëě]', replacement: 'e'},
      {pattern: '[ìíîï]', replacement: 'i'},
      {pattern: '[ňñ]', replacement: 'n'},
      {pattern: '[òóôõö]', replacement: 'o'},
      {pattern: 'œ', replacement: 'oe'},
      {pattern: 'ř', replacement: 'r'},
      {pattern: 'š', replacement: 's'},
      {pattern: 'ť', replacement: 't'},
      {pattern: 'ß', replacement: 'ss'},
      {pattern: '[ùúûüů]', replacement: 'u'},
      {pattern: '[ýÿ]', replacement: 'y'},
      {pattern: 'ž', replacement: 'z'}
    ];

    let r = searchString.toLocaleLowerCase();
    diacritics.map(d => {
      r = r.replace(new RegExp(d.pattern, 'g'), d.replacement);
    });
    return r;
  }
}
