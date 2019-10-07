import { ResponseType } from '../enums/response-type.enum';

export interface RequestConfig {
  headers?: object;
  encoding?: string;
  interceptors?: boolean;
  handlers?: boolean;
  key?: string;
  query?: any;
  reportProgress?: boolean;
  responseType?:  ResponseType;
}
