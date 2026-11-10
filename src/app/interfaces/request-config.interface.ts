import { Queue } from '@firestitch/common';

import { HttpContext, HttpInterceptor } from '@angular/common/http';

import { ApiCacheMode } from '../enums/api-cache-mode.enum';
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
  /**
   * For a GET: true or ApiCacheMode.CacheFirst answers from memory for 30
   * minutes; ApiCacheMode.StaleWhileRevalidate hands back the last saved answer
   * at once and then the server's when it differs (see ApiCacheMode).
   */
  cache?: boolean | ApiCacheMode;
  queue?: Queue;
  data?: any;
  context?: HttpContext;
  mapHttpResponseBody?: boolean;
  mapHttpResponseBodyData?: boolean;
  stream?: boolean;
}
