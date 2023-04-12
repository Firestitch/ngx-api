import { Queue } from '@firestitch/common';
import { ResponseType } from '../enums/response-type.enum';
import { HttpContext } from '@angular/common/http';

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
  customQueue?: Queue;
  data?: any;
  context?: HttpContext;
}
