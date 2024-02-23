import { Inject, Injectable, Optional } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Queue } from '@firestitch/common';


import { Observable, merge, of, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import {
  HTTP_INTERCEPTORS,
  HttpEvent,
  HttpEventType,
  HttpRequest,
  HttpResponse,
  HttpXhrBackend,
} from '@angular/common/http';

import { FsApiFile, RequestHandler } from '../classes';
import { ApiCache } from '../classes/api-cache';
import { FsApiConfig } from '../classes/api-config';
import { StreamEventType } from '../enums';
import {
  FS_API_CONFIG,
  FS_API_REQUEST_INTERCEPTOR,
  FS_API_RESPONSE_DATA_HANDLER,
  FS_API_RESPONSE_HANDLER,
} from '../fs-api-providers';
import { FsApiCacheHandler } from '../handlers/cache.handler';
import { FsApiResponseBodyHandler } from '../handlers/response-body.handler';
import { FsApiResponseHandler } from '../handlers/response.handler';
import {
  BodyHandlerInterceptor, HeadersHandlerInterceptor, ParamsHandlerInterceptor,
  RequestInterceptor,
} from '../interceptors';
import { RequestConfig } from '../interfaces';
import { FsApiBaseHander } from '../interfaces/handler.interface';
import { IModuleConfig } from '../interfaces/module-config.interface';
import { StreamEvent } from '../types';


@Injectable()
export class FsApi {

  public events = [];

  private readonly _queue = new Queue(5);
  private _cache = new ApiCache();
  private _responseHandlers: FsApiBaseHander[] = [new FsApiResponseHandler()];
  private _responseBodyHandlers: FsApiBaseHander[] = [new FsApiResponseBodyHandler()];

  constructor(
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

  public stream(
    method: string,
    url: string,
    data?: any,
    requestConfig?: RequestConfig,
  ): Observable<StreamEvent> {
    const config = new FsApiConfig({
      ...this._config,
      ...requestConfig,
      stream: true,
    }, method, data);

    let idx = 0;

    return this._getInterceptorChain(config, config.data)
      .handle(this._createHttpRequest(config, url))
      .pipe(
        filter((event: HttpEvent<any>) => {
          return event?.type === HttpEventType.DownloadProgress ||
          event?.type === HttpEventType.Response;
        }),
        switchMap((event: HttpEvent<any>) => {
          if(event.type === HttpEventType.DownloadProgress) {
            const partialText = (event as any).partialText;
            const text = partialText.substring(idx).trim();
            const data$ = text.split('\n')
              .map((item) => {
                return of({ type: StreamEventType.Data, data: JSON.parse(item) });
              });

            idx = partialText.length - 1;

            return merge(...data$);
          }

          return of({
            ...data,
            type: StreamEventType.HttpResponse,
          });
        }),
      );
  }

  public request(
    method: string,
    url: string,
    data?: any,
    requestConfig?: RequestConfig,
  ): Observable<any> {
    const config = new FsApiConfig({ ...this._config, ...requestConfig }, method, data);

    if (config.methodGet) {
      if (config.cache) {
        const cache = this.cache.get(url, config.query);
        if (cache) {
          return of(cache);
        }
      }
    }

    const request = this._createHttpRequest(config, url);
    const handlers = this._getHandlers(config);

    // Do request and process the answer
    const chainedRequest = this._getInterceptorChain(config, config.data)
      .handle(request)
      .pipe(
        filter((event: HttpEvent<any>) => {
          return config.reportProgress || event instanceof HttpResponse;
        }),
        tap((event: HttpResponse<any>) => {
          if (event.type === HttpEventType.Response) {
            handlers.forEach((handler: FsApiBaseHander) => {
              handler.success(event, config, request);
            });
          }
        }),
        map((event: HttpResponse<any>) => {
          return ((config.mapHttpResponseBody ?? true) && event.type === HttpEventType.Response) ?
            event.body :
            event;
        }),
        tap(() => {
          handlers.forEach((handler: FsApiBaseHander) => {
            handler.complete(config);
          });
        }),
        catchError((error) => {
          handlers.forEach((handler: FsApiBaseHander) => {
            handler.error(error, config);
          });

          return throwError(error);
        }),
      );

    // Depends on encoding will send in queue or raw
    if (config.encoding === 'formdata') {
      if (config.queue) {
        return config.queue.push(chainedRequest);
      }

      return this._queue.push(chainedRequest);
    }

    return chainedRequest;
  }

  private _createHttpRequest(config: FsApiConfig, url: string) {
    return new HttpRequest(config.method, url, null, {
      responseType: config.responseType,
      context: config.context,
    });
  }

  private _getHandlers(config: RequestConfig): FsApiBaseHander[] {
    const handlers = [];

    if(config.stream) {
      return handlers;
    }

    if (config.handlers) {
      handlers.push(...this._responseBodyHandlers);
      handlers.push(...this._responseHandlers);
    }

    handlers.push(new FsApiCacheHandler(this._cache));

    return handlers;
  }

  private _getInterceptorChain(config, data): RequestHandler {
    const interceptors: RequestInterceptor[] = [
      new HeadersHandlerInterceptor(config, data),
      new BodyHandlerInterceptor(config, data),
      new ParamsHandlerInterceptor(config, data),
    ];

    if (config.interceptors) {
      // Add custom interceptors into chain
      if (Array.isArray(this._requestInterceptors)) {
        interceptors.push(
          ...this._requestInterceptors
            .map((interceptor) => interceptor(config, data)),
        );
      } else if (this._requestInterceptors) {
        const interceptor = this._requestInterceptors(config, data);

        interceptors.push(interceptor);
      }

      interceptors.push(...this._httpInterceptors);
    }


    // Executing of interceptors
    return interceptors
      .reduceRight((next: any, interceptor: any) => {
        return new RequestHandler(next, interceptor);
      }, this._http);
  }
}
