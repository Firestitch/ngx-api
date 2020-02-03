import { ResponseType } from '../enums/response-type.enum';

export interface RequestConfig {
  headers?: Record<string, string | string[]>;
  encoding?: string;
  interceptors?: boolean;
  handlers?: boolean;
  key?: string;
  query?: any;
  reportProgress?: boolean;
  responseType?:  ResponseType;
  cache?: boolean;
}
