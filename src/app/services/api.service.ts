import { Inject, Injectable, Optional } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Queue } from '@firestitch/common';


import { Observable, merge, of, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpRequest,
  HttpResponse,
  HttpXhrBackend,
} from '@angular/common/http';

import { FsApiFile, RequestHandler } from '../classes';
import { ApiCache } from '../classes/api-cache';
import { FsApiConfig } from '../classes/api-config';
import { RequestMethod, ResponseType, StreamEventType } from '../enums';
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
import { FsApiFileConfig, RequestConfig } from '../interfaces';
import { FsApiBaseHander } from '../interfaces/handler.interface';
import { IModuleConfig } from '../interfaces/module-config.interface';
import { StreamEvent } from '../types';


@Injectable({
  providedIn: 'root',
})
export class FsApi {

  public events = [];

  private readonly _queue = new Queue(5);
  private _cache = new ApiCache();
  private _responseHandlers: FsApiBaseHander[] = [];
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

  public createApiFile(
    url: string,
    config?: FsApiFileConfig,
  ) {
    return new FsApiFile(this, url, config);
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

  public get(url: RequestMethod | string, query?: any, config?: RequestConfig) {
    return this.request(RequestMethod.Get, url, query, config);
  }

  public post(url: RequestMethod | string, data?: any, config?: RequestConfig): Observable<any> {
    return this.request(RequestMethod.Post, url, data, config);
  }

  public put(url: RequestMethod | string, data?: any, config?: RequestConfig): Observable<any> {
    return this.request(RequestMethod.Put, url, data, config);
  }

  public delete(url: RequestMethod | string, data?: any, config?: RequestConfig): Observable<any> {
    return this.request(RequestMethod.Delete, url, data, config);
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
            let data$;
            try {
              const partialText = (event as any).partialText;
              const text = partialText.substring(idx).trim();
            
              data$ = text.split('\n')
                .map((item) => {
                  const itemData = JSON.parse(item);

                  if(itemData?.code > 200) {
                    throw new HttpErrorResponse({
                      status: itemData.code,
                      statusText: itemData.message,
                      error: itemData,
                    });
                  }

                  return of({ type: StreamEventType.Data, data: itemData });
                });

              idx = partialText.length - 1;

            } catch(error) {
              if(!(error instanceof HttpErrorResponse)) {
                return throwError(new HttpErrorResponse({
                  status: 400,
                  statusText: error,
                }));
              }

              return throwError(error);
            } 
            
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
    method: RequestMethod | string,
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
        switchMap((event: HttpResponse<any>) => {
          if(event.body?.code > 200) {
            const error = new HttpErrorResponse({
              status: event.body.code,
              statusText: event.body.message,
              error: event.body,
              headers: event.headers,
              url: event.url,
            });

            return throwError(event.body.message);
          }

          if (event.type === HttpEventType.Response) {
            handlers.forEach((handler: FsApiBaseHander) => {
              handler.success(event, config, request);
            });
          }

          return of(event);
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
    // TODO: Not sure why we are doing this
    if (config.encoding === 'formdata') {
      if (config.queue) {
        return config.queue.push(chainedRequest);
      }

      return this._queue.push(chainedRequest);
    }

    return chainedRequest;
  }


  public download(name: string, method, url: string, data = null): void {
    this.file(method, url, data)
      .subscribe((file: File) => {
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = URL.createObjectURL(file);
        name = name ? name : file.name;
        if (name) {
          a.download = name;
        }

        a.click();
        setTimeout(() => {
          URL.revokeObjectURL(a.href);
          a.parentNode.removeChild(a);
        }, 0);
      });
  }

  public file(method, url: string, data = null, requestConfig: RequestConfig = null): Observable<File> {
    return this.request(method, url, data, {
      handlers: false,
      responseType: ResponseType.Blob,
      mapHttpResponseBody: false,
      ...requestConfig,
    })
      .pipe(
        map((event: HttpResponse<any>) => {
          let filename = (event.headers.getAll('Content-Disposition') || [])
            .reduce((accum, item) => {
              const matches = item.match(/filename="([^"]+)"/);

              return matches ? matches[1] : accum;
            }, '');

          if (!filename) {
            filename = (new URL(event.url))
              .pathname.split('/').pop();
          }

          const type = event.headers.get('Content-Type');

          return new File([event.body], filename, { type });
        }),
      );
  }

  private _createHttpRequest(config: FsApiConfig, url: string) {
    return new HttpRequest(config.method, url, null, {
      responseType: config.responseType,
      context: config.context,
    });
  }

  private _getHandlers(config: RequestConfig): FsApiBaseHander[] {
    const handlers = [];

    if (!config.stream && config.handlers) {
      handlers.push(...this._responseBodyHandlers);
      handlers.push(...this._responseHandlers);
      handlers.push(new FsApiCacheHandler(this._cache));
    }

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
