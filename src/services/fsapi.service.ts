import { Inject, Injectable, Injector, Optional } from '@angular/core';
import {
  HttpRequest,
  HttpEventType,
  HttpXhrBackend,
  HttpEvent,
  HttpResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { map, tap, filter } from 'rxjs/operators';
import * as moment from 'moment-timezone';
import { forEach, isObject } from 'lodash';

import { FsApiConfig, RequestHandler } from '../classes';

import {
  HeadersHandlerInterceptor,
  BodyHandlerInterceptor,
  ParamsHandlerInterceptor,
} from '../interceptors';

import {
  FS_API_REQUEST_INTERCEPTOR,
  FS_API_RESPONSE_HANDLER,
} from '../fsapi-providers';

import { FsApiResponseHandler } from '../interceptors/base';


@Injectable()
export class FsApi {

  public events = [];

  constructor(private apiConfig: FsApiConfig,
              private http: HttpXhrBackend,
              private injector: Injector,
              // Custom interceptors
              @Optional() @Inject(HTTP_INTERCEPTORS) private httpInterceptors,

              // Custom interceptors
              @Optional() @Inject(FS_API_REQUEST_INTERCEPTOR) private requestInterceptors,

              // Other callbacks
              @Optional() @Inject(FS_API_RESPONSE_HANDLER) private responseHandler: FsApiResponseHandler) {
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
    return handlersChain.handle(request)
      .pipe(
        filter((event) => {
          return config.reportProgress || event instanceof HttpResponse;
        }),
        tap((event: HttpEvent<any>) => {
          if (event.type === HttpEventType.Response) {
            this.responseHandler.success(event, config);
          }
        }),
        map((event: HttpEvent<any>) => {
          return (event.type === HttpEventType.Response) ? event.body : event;
        }),
        tap({
          error: (err) => this.responseHandler.error(err, config),
          complete: () => this.responseHandler.complete(config)
        })
      );
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
