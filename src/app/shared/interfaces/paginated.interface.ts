import { IPaginatedResult } from './paginated-result.interface';

export interface IPaginated {
  count: number;
  next: string;
  previous: string;
  results: IPaginatedResult[];
  selected?: boolean;
}
