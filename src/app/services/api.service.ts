import { Inject, Injectable, Optional } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Queue } from '@firestitch/common';


import { Observable, of } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpEventType,
  HttpRequest,
  HttpResponse,
  HttpXhrBackend,
} from '@angular/common/http';
import { format, isDate, isValid } from 'date-fns';

import { FsApiFile } from '../classes';
import { ApiCache } from '../classes/api-cache';
import { FsApiConfig } from '../classes/api-config';
import { RequestHandler } from '../classes/request-handler';
import {
  FS_API_CONFIG,
  FS_API_REQUEST_INTERCEPTOR,
  FS_API_RESPONSE_DATA_HANDLER,
  FS_API_RESPONSE_HANDLER,
} from '../fs-api-providers';
import { FsApiCacheHandler } from '../handlers/cache.handler';
import { FsApiResponseBodyHandler } from '../handlers/response-body.handler';
import { FsApiResponseHandler } from '../handlers/response.handler';
import { BodyHandlerInterceptor } from '../interceptors/body-handler.interceptor';
import { HeadersHandlerInterceptor } from '../interceptors/headers-handler.interceptor';
import { ParamsHandlerInterceptor } from '../interceptors/params-handler.interceptor';
import { RequestConfig } from '../interfaces';
import { FsApiBaseHander } from '../interfaces/handler.interface';
import { IModuleConfig } from '../interfaces/module-config.interface';


@Injectable()
export class FsApi {

  public events = [];

  private readonly _queue = new Queue(5);
  private _cache = new ApiCache();
  private _responseHandlers = [new FsApiResponseHandler()];
  private _responseBodyHandlers = [new FsApiResponseBodyHandler()];

  constructor(
    private _apiConfig: FsApiConfig,
    private _http: HttpXhrBackend,
    private _sanitizer: DomSanitizer,
    // Custom interceptors
    @Optional() @Inject(FS_API_CONFIG)
    private _config: IModuleConfig,

    // Custom interceptors
    @Optional() @Inject(HTTP_INTERCEPTORS)
    private _httpInterceptors,

    // Custom interceptors
    @Optional() @Inject(FS_API_REQUEST_INTERCEPTOR)
    private _requestInterceptors,

    // Other callbacks
    @Optional() @Inject(FS_API_RESPONSE_HANDLER)
    private _responseHandler: FsApiResponseHandler,

    // Other callbacks
    @Optional() @Inject(FS_API_RESPONSE_DATA_HANDLER)
    private _responseBodyHandler: FsApiResponseBodyHandler,
  ) {
    if(_responseHandler) {
      this._responseHandlers = Array.isArray(_responseHandler) ?
        _responseHandler :
        [_responseHandler];
    }

    if(_responseBodyHandler) {
      this._responseBodyHandlers = Array.isArray(_responseBodyHandler) ?
        _responseBodyHandler :
        [_responseBodyHandler];
    }

    this._queue.setLimit((this._config && this._config.maxFileConnections) || 5);
  }

  public createApiFile(url: string, filename?: string) {
    return new FsApiFile(this, url, filename);
  }

  public get queue() {
    return this._queue;
  }

  public get cache() {
    return this._cache;
  }

  public get sanitizer(): DomSanitizer {
    return this._sanitizer;
  }

  public get(url, query?: any, config?: RequestConfig) {
    return this.request('GET', url, query, config);
  }

  public post(url, data?: any, config?: RequestConfig): Observable<any> {
    return this.request('POST', url, data, config);
  }

  public put(url, data?: any, config?: RequestConfig): Observable<any> {
    return this.request('PUT', url, data, config);
  }

  public delete(url, data?: any, config?: RequestConfig): Observable<any> {
    return this.request('DELETE', url, data, config);
  }

  public request(method: string, url: string, data?: object, config?: RequestConfig): Observable<any> {
    config = Object.assign(new FsApiConfig(), this._apiConfig, config);
    method = method.toUpperCase();
    data = this._sanitize(data);

    if (method === 'GET') {
      config.query = data;
      data = {};

      if (config.cache) {
        const cache = this.cache.get(url, config.query);
        if (cache) {
          return of(cache);
        }
      }
    }

    // Create clear request
    const request = new HttpRequest((method as any), url, null, {
      responseType: config.responseType,
      context: config.context,
    });

    const INTERCEPTORS: any = [
      new HeadersHandlerInterceptor(config, data),
      new BodyHandlerInterceptor(config, data),
      new ParamsHandlerInterceptor(config, data),
    ];

    if (config.interceptors) {

      // Add custom interceptors into chain
      if (Array.isArray(this._requestInterceptors)) {
        const interceptors = this._requestInterceptors
          .map((interceptor) => interceptor(config, data));

        INTERCEPTORS.push(...interceptors);
      } else if (this._requestInterceptors) {
        const interceptor = this._requestInterceptors(config, data);

        INTERCEPTORS.push(interceptor);
      }

      INTERCEPTORS.push(...this._httpInterceptors);
    }

    const handlers = [];
    if (config.handlers) {
      handlers.push(...this._responseBodyHandlers);
      handlers.push(...this._responseHandlers);
    }

    handlers.push(new FsApiCacheHandler(this._cache));

    // Executing of interceptors
    const handlersChain = INTERCEPTORS.reduceRight(
      (next: any, interceptor: any) => new RequestHandler(next, interceptor), this._http);

    // Do request and process the answer
    const chainedRequest = handlersChain.handle(request)
      .pipe(
        filter((event) => {
          return config.reportProgress || event instanceof HttpResponse;
        }),
        tap((event: HttpEvent<any>) => {
          if (event.type === HttpEventType.Response) {
            handlers.forEach((handler: FsApiBaseHander) => {
              handler.success(event, config, request);
            });
          }
        }),
        map((event: HttpEvent<any>) => {
          return ((config.mapHttpResponseBody ?? true) && event.type === HttpEventType.Response) ? event.body : event;
        }),
        tap({
          error: (err) => {
            handlers.forEach((handler: FsApiBaseHander) => {
              handler.error(err, config);
            });
          },
          complete: () => {
            handlers.forEach((handler: FsApiBaseHander) => {
              handler.complete(config);
            });
          },
        }),
      );

    // Depends on encoding will send in queue or raw
    if (config.encoding === 'formdata') {
      if (config.customQueue) {
        return config.customQueue.push(chainedRequest);
      }

      return this._queue.push(chainedRequest);
    }

    return chainedRequest;
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
