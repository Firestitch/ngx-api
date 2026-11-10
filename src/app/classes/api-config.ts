
import { Queue } from '@firestitch/common';


import { HttpContext, HttpInterceptor } from '@angular/common/http';
import { format, isDate, isValid } from 'date-fns';

import { ApiCacheMode } from '../enums/api-cache-mode.enum';
import { ResponseType } from '../enums/response-type.enum';
import { RequestConfig } from '../interfaces';


export class FsApiConfig {

  /** A key value store for the request headers. */
  public headers?: Record<string, string | string[]> = {};
  public encoding: 'json' | 'formdata' | 'url';
  public interceptors: (interceptors: HttpInterceptor[]) => HttpInterceptor[];
  public handlers = true;
  public key?: string = null;
  public query?: object = {};
  public reportProgress = false;
  public responseType: ResponseType = ResponseType.Json;
  public queue: Queue;
  public data: any;
  public stream: boolean;
  public cache?: boolean | ApiCacheMode;
  public mapHttpResponseBody?: boolean;
  public mapHttpResponseBodyData?: boolean;
  public context?: HttpContext;

  constructor(
    private _config: RequestConfig,
    private _method: string,
    private _data: any,
  ) {
    const config = {
      encoding: 'json',
      ...(this._config || {}),
    };

    Object.assign(this, config);

    if(this.methodGet) {
      this.query = this._sanitize(this._data);
    } else {
      this.data = this._sanitize(this._data);
    }

    if(this.stream) {
      this.reportProgress = true;
      this.responseType = ResponseType.Text;
    }
  }

  public get method() {
    return this._method.toUpperCase();
  }

  public get methodGet() {
    return this.method === 'GET';
  }

  /** The in-memory, 30 minute cache: `cache: true` or ApiCacheMode.CacheFirst. */
  public get cacheFirst(): boolean {
    return this.cache === true || this.cache === ApiCacheMode.CacheFirst;
  }

  /**
   * A GET whose answer is saved and handed back on the next call before the
   * server's (ApiCacheMode.StaleWhileRevalidate). Only a JSON body handed back
   * as the value: a file, a progress event or a raw HttpResponse is not an
   * answer that can be saved and compared.
   */
  public get staleWhileRevalidate(): boolean {
    return this.cache === ApiCacheMode.StaleWhileRevalidate
      && this.methodGet
      && this.responseType === ResponseType.Json
      && (this.mapHttpResponseBody ?? true)
      && !this.reportProgress
      && !this.stream;
  }

  /** Adds or overrides a header value based on the name */
  public appendHeader(name: string, value: string) {
    this.headers[name] = value;
  }

  /**
   * Sanitize the passed object
   *
   * @param obj
   */
  private _sanitize(obj, data = {}) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    Object.keys(obj)
      .forEach((key) => {
        const value = obj[key];
        if (value !== undefined) {
          if (isDate(value)) {
            if (isValid(value)) {
              data[key] = format(value, 'yyyy-MM-dd\'T\'HH:mm:ssxxx');
            }
          } else if (Array.isArray(value)) {
            data[key] = [
              ...value,
            ];

            this._sanitize(value, data[key]);
          } else if (value instanceof Blob) {
            data[key] = value;
          } else if (value instanceof Object) {
            data[key] = {
              ...value,
            };

            this._sanitize(value, data[key]);
          } else {
            data[key] = value;
          }
        }
      });

    return data;
  }
}
