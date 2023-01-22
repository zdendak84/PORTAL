import { Moment } from 'moment';

export interface ListingFilterModel {
  locationId?: number;
  workplaceId?: number;
  dateFrom?: Moment;
  dateTo?: Moment;
  shift?: number;
}
