import { Injectable, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Queue } from '@firestitch/common';


import { EMPTY, Observable, concat, of, throwError } from 'rxjs';
import { catchError, concatMap, ignoreElements, map, switchMap, tap } from 'rxjs/operators';

import { HTTP_INTERCEPTORS, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpXhrBackend } from '@angular/common/http';

import { FsApiFile, RequestHandler } from '../classes';
import { ApiCache } from '../classes/api-cache';
import { FsApiConfig } from '../classes/api-config';
import { RequestMethod, ResponseType } from '../enums';
import {
  FS_API_CACHE_STORAGE,
  FS_API_CONFIG,
  FS_API_PRE_REQUEST_INTERCEPTOR,
  FS_API_PRE_RESPONSE_INTERCEPTOR,
  FS_API_REQUEST_INTERCEPTOR,
  FS_API_RESPONSE_HANDLER,
} from '../fs-api-injectors';
import { FsApiCacheHandler } from '../handlers/cache.handler';
import { apiCacheSignature, staleWhileRevalidate } from '../helpers';
import { FsApiResponseHandler } from '../handlers/response.handler';
import {
  BodyRequestInterceptor,
  BodyResponseInterceptor,
  HeaderRequestInterceptor,
  ParamRequestInterceptor,
  StreamResponseInterceptor,
} from '../interceptors';
import { ApiCacheStorage, FsApiFileConfig, RequestConfig } from '../interfaces';
import { FsApiBaseHander } from '../interfaces/handler.interface';
import { IModuleConfig } from '../interfaces/module-config.interface';


@Injectable({
  providedIn: 'root',
})
export class FsApi {
  private _http = inject(HttpXhrBackend);
  private _sanitizer = inject(DomSanitizer);
  private _config = inject<IModuleConfig>(FS_API_CONFIG, { optional: true });
  private _httpInterceptors = inject(HTTP_INTERCEPTORS, { optional: true });
  private _requestInterceptors = inject(FS_API_REQUEST_INTERCEPTOR, { optional: true });
  private _preRequestInterceptors = inject(FS_API_PRE_REQUEST_INTERCEPTOR, { optional: true });
  private _preResponseInterceptors = inject(FS_API_PRE_RESPONSE_INTERCEPTOR, { optional: true });
  private _responseHandler = inject<FsApiResponseHandler>(FS_API_RESPONSE_HANDLER, { optional: true });
  private _cacheStorage = inject<ApiCacheStorage>(FS_API_CACHE_STORAGE, { optional: true });


  public events = [];

  private readonly _queue = new Queue(5);
  private _cache = new ApiCache();
  private _responseHandlers: FsApiBaseHander[] = [];
  private _responseBodyHandlers: FsApiBaseHander[] = [];

  constructor() {
    if(this._responseHandler) {
      this._responseHandlers = Array.isArray(this._responseHandler) ?
        this._responseHandler :
        [this._responseHandler];
    }

    this._queue.setLimit((this._config && this._config.maxFileConnections) || 5);
  }

  public createApiFile(
    url: string | (string|number)[],
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

  /**
   * Removes every answer ApiCacheMode.StaleWhileRevalidate saved. An app with
   * sign-in calls it on sign-out. Nothing to do without FS_API_CACHE_STORAGE.
   */
  public clearCacheStorage(): Observable<void> {
    return this._cacheStorage ? this._cacheStorage.clear() : of(null);
  }

  public get(url: RequestMethod | string | (string|number)[], query?: any, config?: RequestConfig) {
    return this.request(RequestMethod.Get, url, query, config);
  }

  public post(url: RequestMethod | string | (string|number)[], data?: any, config?: RequestConfig): Observable<any> {
    return this.request(RequestMethod.Post, url, data, config);
  }

  public put(url: RequestMethod | string | (string|number)[], data?: any, config?: RequestConfig): Observable<any> {
    return this.request(RequestMethod.Put, url, data, config);
  }

  public delete(url: RequestMethod | string | (string|number)[], data?: any, config?: RequestConfig): Observable<any> {
    return this.request(RequestMethod.Delete, url, data, config);
  }

  public stream(
    method: string,
    url: string,
    data?: any,
    requestConfig?: RequestConfig,
  ): Observable<any> {
    const config = new FsApiConfig({
      ...this._config,
      ...requestConfig,
      stream: true,
    }, method, data);

    return this._getInterceptorChain(config, config.data)
      .handle(this._createHttpRequest(config, url));
  }

  public request(
    method: RequestMethod | string,
    url: string | (string|number)[],
    data?: any,
    requestConfig?: RequestConfig,
  ): Observable<any> {
    const config = new FsApiConfig({ ...this._config, ...requestConfig }, method, data);
    url = Array.isArray(url) ? url.join('/') : url;

    if (config.methodGet) {
      if (config.cacheFirst) {
        const cache = this.cache.get(url, config.query);
        if (cache) {
          return of(cache);
        }
      }
    }

    if (config.staleWhileRevalidate && !this._cacheStorage) {
      return throwError(() => new Error(
        'ApiCacheMode.StaleWhileRevalidate needs FS_API_CACHE_STORAGE: add provideFsApiCacheStorage() from @firestitch/api/db',
      ));
    }

    const request = this._createHttpRequest(config, url);
    const handlers = this._getHandlers(config);

    // Do request and process the answer
    const chainedRequest = this._getInterceptorChain(config, config.data)
      .handle(request)
      .pipe(
        switchMap((event: HttpResponse<any>) => {
          handlers
            .forEach((handler: FsApiBaseHander) => {
              handler.success(event, config, request);
            });

          return of(event);
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

    if (config.staleWhileRevalidate) {
      return staleWhileRevalidate(
        this._cacheStorage,
        apiCacheSignature(config.method, url, config.query, this._config?.cacheScope?.()),
        chainedRequest,
      );
    }

    const sentRequest = this._clearCacheStorageOnSave(config, chainedRequest);

    // Depends on encoding will send in queue or raw
    // TODO: Not sure why we are doing this
    if (config.encoding === 'formdata') {
      if (config.queue) {
        return config.queue.push(sentRequest);
      }

      return this._queue.push(sentRequest);
    }

    return sentRequest;
  }

  public download(name: string, method, url: string, data = null): void {
    this.download$(name, method, url, data)
      .subscribe();
  }

  public download$(name: string, method, url: string, data = null): Observable<any> {
    return this.file(method, url, data)
      .pipe(
        tap((file: File) => {
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
        }),
      );
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
              let matches = item.match(/filename\*=UTF-8''(.*)/);

              if(matches) {
                return decodeURIComponent(matches[1]);
              }

              matches = item.match(/filename="([^"]+)"/);

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

  /**
   * Any request that is not a GET can change what a saved answer says, so once
   * it succeeds every StaleWhileRevalidate answer goes, before the response is
   * handed on: a screen opened from the save's success never reads one the
   * save made stale.
   */
  private _clearCacheStorageOnSave(config: FsApiConfig, request$: Observable<any>): Observable<any> {
    if (config.methodGet || !this._cacheStorage) {
      return request$;
    }

    return request$
      .pipe(
        concatMap((response) => concat(
          this._cacheStorage.clear()
            .pipe(
              ignoreElements(),
              catchError(() => EMPTY),
            ),
          of(response),
        )),
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

  private _getInterceptorChain(config: FsApiConfig, data: any): HttpHandler {
    let interceptors: HttpInterceptor[] = [
      ...this._getInterceptors(config, data, this._preRequestInterceptors),
      new HeaderRequestInterceptor(config, data),      
      new ParamRequestInterceptor(config, data),
      new BodyRequestInterceptor(config, data),
    ];
  
    interceptors = [
      ...interceptors,
      ...this._getInterceptors(config, data, this._requestInterceptors),
    ];

    if(config.stream) {
      interceptors.push(new StreamResponseInterceptor(config, data));
    } else {
      interceptors.push(new BodyResponseInterceptor(config, data));
    }

    interceptors = [
      ...interceptors,
      ...this._getInterceptors(config, data, this._preResponseInterceptors),
      ...(this._httpInterceptors || []),
    ];

    interceptors = config.interceptors ?
      config.interceptors(interceptors) :
      interceptors;

    // Executing of interceptors
    const httpHandlers = interceptors
      .reduceRight((next: HttpHandler, interceptor: HttpInterceptor) => {
        return new RequestHandler(next, interceptor);
      }, this._http);

    return httpHandlers;
  }

  private _getInterceptors(config: FsApiConfig, data: any, interceptors) {
    if(!interceptors) {
      return [];
    } 

    interceptors = Array.isArray(interceptors) ? interceptors : [interceptors];

    return interceptors
      .map((interceptor) => interceptor(config, data));
  }
}
