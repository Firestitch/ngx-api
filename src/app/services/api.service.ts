import { Inject, Injectable, Injector, Optional } from '@angular/core';
import {
  HttpRequest,
  HttpEventType,
  HttpXhrBackend,
  HttpEvent,
  HttpResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { Queue } from '@firestitch/common';

import { Observable } from 'rxjs';
import { map, tap, filter } from 'rxjs/operators';

import * as _moment from 'moment-timezone';
const moment = _moment;

import { forEach, isObject } from 'lodash-es';

import { FsApiConfig } from '../classes/api-config';
import { RequestHandler } from '../classes/request-handler';

import { HeadersHandlerInterceptor } from '../interceptors/headers-handler.interceptor';
import { BodyHandlerInterceptor } from '../interceptors/body-handler.interceptor';
import { ParamsHandlerInterceptor} from '../interceptors/params-handler.interceptor';

import {
  FS_API_CONFIG,
  FS_API_REQUEST_INTERCEPTOR,
  FS_API_RESPONSE_HANDLER,
} from '../fs-api-providers';

import { FsApiResponseHandler } from '../interceptors/base/response.handler';
import { IModuleConfig } from '../interfaces/module-config.interface';


@Injectable()
export class FsApi {

  public events = [];
  private readonly _queue = new Queue(5);

  constructor(
    private apiConfig: FsApiConfig,
    private http: HttpXhrBackend,
    private injector: Injector,
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
    private responseHandler: FsApiResponseHandler
  ) {

    // Queue Limit
    this._queue.setLimit((this.config && this.config.maxFileConnections) || 5);
  }

  get queue() {
    return this._queue;
  }

  public get(url, query?, config?) {
    return this.request('GET', url, query, config);
  }

  public post(url, data?: object, config?): Observable<any> {
    return this.request('POST', url, data, config);
  }

  public put(url, data?: object, config?): Observable<any> {
    return this.request('PUT', url, data, config);
  }

  public delete(url, data?: object, config?): Observable<any> {
    return this.request('DELETE', url, data, config);
  }

  public request(method: string, url: string, data?: object, config?): Observable<any> {
    config = <FsApiConfig>Object.assign({}, this.apiConfig, config);
    method = method.toUpperCase();
    data = Object.assign({}, data);

    this.sanitize(data);

    if (method === 'GET') {
      config.query = data;
      data = {};
    }

    // Create clear request
    const request = new HttpRequest((method as any), url);

    const INTERCEPTORS: any = [
      new HeadersHandlerInterceptor(config, data),
      new BodyHandlerInterceptor(config, data),
      new ParamsHandlerInterceptor(config, data),
    ];

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
            if (this.responseHandler) {
              this.responseHandler.success(event, config);
            }
          }
        }),
        map((event: HttpEvent<any>) => {
          return (event.type === HttpEventType.Response) ? event.body : event;
        }),
        tap({
          error: (err) => {
            if (this.responseHandler) {
              this.responseHandler.error(err, config);
            }
          },
          complete: () => {
            if (this.responseHandler) {
              this.responseHandler.complete(config);
            }
          }
        })
      );

    // Depends on encoding will send in queue or raw
    return (config.encoding === 'formdata')
      ? this._queue.push(chainedRequest)
      : chainedRequest;
  }

  /**
   * Sanitize the passed object
   *
   * @param obj
   * @returns {any}
   */
  private sanitize(obj) {
    const self = this;
    forEach(obj, function (value, key) {
      if (moment && moment.isMoment(value)) {
        obj[key] = value.format();

      } else if (value instanceof Date) {
        obj[key] = moment(value).format();

      } else if (value === undefined) {
        delete obj[key];

      } else if (isObject(value)) {
        self.sanitize(value);
      }
    });

    return obj;
  }
}
