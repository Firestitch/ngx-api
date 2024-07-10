import { Inject, Injectable, Optional } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { Queue } from '@firestitch/common';


import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

import {
  HTTP_INTERCEPTORS,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpXhrBackend,
} from '@angular/common/http';

import { FsApiFile, RequestHandler } from '../classes';
import { ApiCache } from '../classes/api-cache';
import { FsApiConfig } from '../classes/api-config';
import { RequestMethod, ResponseType } from '../enums';
import {
  FS_API_CONFIG,
  FS_API_PRE_REQUEST_INTERCEPTOR,
  FS_API_REQUEST_INTERCEPTOR,
  FS_API_RESPONSE_HANDLER,
} from '../fs-api-providers';
import { FsApiCacheHandler } from '../handlers/cache.handler';
import { FsApiResponseHandler } from '../handlers/response.handler';
import {
  BodyRequestInterceptor,
  BodyResponseInterceptor,
  HeaderRequestInterceptor, ParamRequestInterceptor,
  StreamResponseInterceptor,
} from '../interceptors';
import { FsApiFileConfig, RequestConfig } from '../interfaces';
import { FsApiBaseHander } from '../interfaces/handler.interface';
import { IModuleConfig } from '../interfaces/module-config.interface';


@Injectable({
  providedIn: 'root',
})
export class FsApi {

  public events = [];

  private readonly _queue = new Queue(5);
  private _cache = new ApiCache();
  private _responseHandlers: FsApiBaseHander[] = [];
  private _responseBodyHandlers: FsApiBaseHander[] = [];

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
    private _requestInterceptors: HttpInterceptor[],

    // Pre-request interceptors
    @Optional() @Inject(FS_API_PRE_REQUEST_INTERCEPTOR)
    private _preRequestInterceptors: HttpInterceptor[],

    // Other callbacks
    @Optional() @Inject(FS_API_RESPONSE_HANDLER)
    private _responseHandler: FsApiResponseHandler,

  ) {
    if(_responseHandler) {
      this._responseHandlers = Array.isArray(_responseHandler) ?
        _responseHandler :
        [_responseHandler];
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

  private _getInterceptorChain(config: FsApiConfig, data: any): HttpHandler {
    let interceptors: HttpInterceptor[] = [
      ...this._getInterceptors(config, data, this._preRequestInterceptors),
      new HeaderRequestInterceptor(config, data),      
      new ParamRequestInterceptor(config, data),
      new BodyRequestInterceptor(config, data),
    ];
    
    if (config.interceptors) {
      interceptors = [
        ...interceptors,
        ...this._getInterceptors(config, data, this._requestInterceptors),
      ];
    }

    if(config.stream) {
      interceptors.push(new StreamResponseInterceptor(config, data));
    } else {
      interceptors.push(new BodyResponseInterceptor(config, data));
    }

    if (config.interceptors) {
      interceptors = [
        ...interceptors,
        ...this._httpInterceptors,
      ];
    }

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
