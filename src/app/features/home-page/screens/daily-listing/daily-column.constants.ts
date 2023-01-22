import { ColumnData } from '@shared/model/column-data-model';

export const MOBILE_COLUMNS: ColumnData[] = [
  { displayed: 'shiftUp', name: '' },
  { displayed: 'time', name: 'Čas' },
  { displayed: 'shiftDown', name: '' },
  { displayed: 'patient', name: 'Pacient' },
  { displayed: 'actions', name: '' }
];

export const DESKTOP_COLUMNS: ColumnData[] = [
  { displayed: 'shiftUp', name: '' },
  { displayed: 'time', name: 'Čas' },
  { displayed: 'shiftDown', name: '' },
  { displayed: 'patient', name: 'Pacient' },
  { displayed: 'yearOfBirth', name: 'Narození' },
  { displayed: 'telephoneNumber', name: 'Telefonní číslo' },
  { displayed: 'side', name: 'Část těla' },
  { displayed: 'injury', name: 'Problém' },
  { displayed: 'operation', name: 'Operace / Vyšetření' },
  { displayed: 'duration', name: 'Doba' },
  { displayed: 'operationDescription', name: '' },
  { displayed: 'rehabilitation', name: 'RHB' },
  { displayed: 'description', name: 'Poznámka' },
  { displayed: 'actions', name: '' }
];
