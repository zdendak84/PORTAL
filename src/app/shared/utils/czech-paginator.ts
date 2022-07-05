import { MatPaginatorIntl } from '@angular/material/paginator';

const czechRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length === 0 || pageSize === 0) { return `0 až ${length}`; }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  const endIndex = startIndex < length ?
    Math.min(startIndex + pageSize, length) :
    startIndex + pageSize;

  return `${startIndex + 1} - ${endIndex} z celkových ${length}`;
};


export function getCzechPaginatorIntl(): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Počet záznamů na stránku:';
  paginatorIntl.nextPageLabel = 'Další stránka';
  paginatorIntl.previousPageLabel = 'Předchozí stránka';
  paginatorIntl.firstPageLabel = 'První stránka';
  paginatorIntl.lastPageLabel = 'Poslední stránka';
  paginatorIntl.getRangeLabel = czechRangeLabel;

  return paginatorIntl;
}
