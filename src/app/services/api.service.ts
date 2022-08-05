import { Inject, Injectable, Optional } from '@angular/core';
import {
  HttpRequest,
  HttpEventType,
  HttpXhrBackend,
  HttpEvent,
  HttpResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { Queue } from '@firestitch/common';

import { Observable, of } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

import { isDate, isValid, format } from 'date-fns';

import { FsApiConfig } from '../classes/api-config';
import { RequestHandler } from '../classes/request-handler';

import { HeadersHandlerInterceptor } from '../interceptors/headers-handler.interceptor';
import { BodyHandlerInterceptor } from '../interceptors/body-handler.interceptor';
import { ParamsHandlerInterceptor} from '../interceptors/params-handler.interceptor';

import {
  FS_API_CONFIG,
  FS_API_REQUEST_INTERCEPTOR,
  FS_API_RESPONSE_HANDLER,
  FS_API_RESPONSE_DATA_HANDLER,
} from '../fs-api-providers';

import { FsApiResponseHandler } from '../handlers/response.handler';
import { FsApiResponseBodyHandler } from '../handlers/response-body.handler';
import { FsApiCacheHandler } from '../handlers/cache.handler';
import { IModuleConfig } from '../interfaces/module-config.interface';
import { RequestConfig } from '../interfaces';
import { FsApiBaseHander } from '../interfaces/handler.interface';
import { ApiCache } from '../classes/api-cache';


@Injectable()
export class FsApi {

  public events = [];
  
  private readonly _queue = new Queue(5);
  private _cache = new ApiCache();

  constructor(
    private apiConfig: FsApiConfig,
    private http: HttpXhrBackend,
    // Custom interceptors
    @Optional() @Inject(FS_API_CONFIG)
    private config: IModuleConfig,

    // Custom interceptors
    @Optional() @Inject(HTTP_INTERCEPTORS)
    private httpInterceptors,

    // Custom interceptors
    @Optional() @Inject(FS_API_REQUEST_INTERCEPTOR)
    private requestInterceptors,

    // Other callbacks
    @Optional() @Inject(FS_API_RESPONSE_HANDLER)
    private responseHandler: FsApiResponseHandler,

    // Other callbacks
    @Optional() @Inject(FS_API_RESPONSE_DATA_HANDLER)
    private responseBodyHandler: FsApiResponseBodyHandler,
  ) {
    this.responseHandler = responseHandler ? responseHandler : new FsApiResponseHandler();
    this.responseBodyHandler = responseBodyHandler ? responseBodyHandler : new FsApiResponseBodyHandler();
    this._queue.setLimit((this.config && this.config.maxFileConnections) || 5);
  }

  get queue() {
    return this._queue;
  }

  get cache() {
    return this._cache;
  }

  public get(url, query?, config?: RequestConfig) {
    return this.request('GET', url, query, config);
  }

  public post(url, data?: object, config?: RequestConfig): Observable<any> {
    return this.request('POST', url, data, config);
  }

  public put(url, data?: object, config?: RequestConfig): Observable<any> {
    return this.request('PUT', url, data, config);
  }

  public delete(url, data?: object, config?: RequestConfig): Observable<any> {
    return this.request('DELETE', url, data, config);
  }

  public request(method: string, url: string, data?: object, config?: RequestConfig): Observable<any> {
    config = Object.assign(new FsApiConfig(), this.apiConfig, config);
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
    const request = new HttpRequest((method as any), url, null, { responseType: config.responseType });

    const INTERCEPTORS: any = [
      new HeadersHandlerInterceptor(config, data),
      new BodyHandlerInterceptor(config, data),
      new ParamsHandlerInterceptor(config, data),
    ];

    if (config.interceptors) {

      // Add custom interceptors into chain
      if (Array.isArray(this.requestInterceptors)) {
        const interceptors = this.requestInterceptors
          .map((interceptor) => interceptor(config, data));

        INTERCEPTORS.push(...interceptors);
      } else if (this.requestInterceptors) {
        const interceptor = this.requestInterceptors(config, data);

        INTERCEPTORS.push(interceptor);
      }

      INTERCEPTORS.push(...this.httpInterceptors);
    }

    const handlers = [];
    if (config.handlers) {
      handlers.push(this.responseBodyHandler);
      handlers.push(this.responseHandler);
    }

    handlers.push(new FsApiCacheHandler(this._cache));

    // Executing of interceptors
    const handlersChain = INTERCEPTORS.reduceRight(
      (next: any, interceptor: any) => new RequestHandler(next, interceptor), this.http);

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
          return (event.type === HttpEventType.Response) ? event.body : event;
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
          }
        })
      );

    // Depends on encoding will send in queue or raw
    if (config.encoding === 'formdata') {
      if (config.customQueue) {
        return config.customQueue.push(chainedRequest);
      } else {
        return this._queue.push(chainedRequest);
      }
    } else {
      return chainedRequest;
    }
  }

  /**
   * Sanitize the passed object
   *
   * @param obj
   */
  private _sanitize(obj, data = {}) {
    Object.keys(obj)
    .forEach((key) => {
      const value = obj[key];
      if (isDate(value)) {
        if (isValid(value)) {
          data[key] = format(value, 'yyyy-MM-dd\'T\'HH:mm:ssxxx');
        }
      } else if (value !== undefined) {
        data[key] = value;

        if (value instanceof Object) {
          this._sanitize(value, data[key]);      
        }
      }
    });

    return data;
  }
}
