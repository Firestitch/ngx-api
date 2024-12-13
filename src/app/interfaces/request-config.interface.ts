import { Queue } from '@firestitch/common';

import { HttpContext, HttpInterceptor } from '@angular/common/http';

import { ResponseType } from '../enums/response-type.enum';

export interface RequestConfig {
  headers?: Record<string, string | string[]>;
  encoding?: 'json' | 'url' | 'formdata';
  interceptors?: (interceptors: HttpInterceptor[]) => HttpInterceptor[];
  handlers?: boolean;
  key?: string;
  query?: any;
  reportProgress?: boolean;
  responseType?:  ResponseType;
  cache?: boolean;
  queue?: Queue;
  data?: any;
  context?: HttpContext;
  mapHttpResponseBody?: boolean;
  mapHttpResponseBodyData?: boolean;
  stream?: boolean;
}
