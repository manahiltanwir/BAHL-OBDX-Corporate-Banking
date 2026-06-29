import { AxiosError } from 'axios';

export interface Pagination {
  page?: number
  total?: number
  limit?: number
}

export interface GetParams {
  query?: { [key: string]: string }
  pagination?: Pagination
}

export interface AxiosErrorResponse extends AxiosError {
  // status: number;
  // message: string;
  // errors: string[] | Record<string, unknown>;
}
