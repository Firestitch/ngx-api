import { Inject, Injectable, Optional } from '@angular/core';
import {
  HttpRequest,
  HttpEventType,
  HttpXhrBackend,
  HttpEvent,
} from '@angular/common/http';

import { FsApiConfig, RequestHandler } from '../classes';

import {
  HeadersHandlerInterceptor,
  BodyHandlerInterceptor,
  ParamsHandlerInterceptor,
} from '../interceptors';

import {
  API_COMPLETE_HANDLER,
  API_CUSTOM_INTERCTEPTORS,
  API_ERROR_HANDLER,
  API_SUCCESS_HANDLER,
} from '../fsapi-providers';

import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import * as moment from 'moment-timezone';
import { forEach, isObject } from 'lodash';


@Injectable()
export class FsApi {

  events = [];

  constructor(private apiConfig: FsApiConfig, private http: HttpXhrBackend,
              // Custom interceptors
              @Optional() @Inject(API_CUSTOM_INTERCTEPTORS) private customInterceptors,

              // Other callbacks
              @Optional() @Inject(API_SUCCESS_HANDLER) private successHandler,
              @Optional() @Inject(API_ERROR_HANDLER) private errorHandler,
              @Optional() @Inject(API_COMPLETE_HANDLER) private completeHandler) {
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
    if (Array.isArray(this.customInterceptors)) {
      const interceptors = this.customInterceptors
        .map((interceptor) => new interceptor(config, data));

      INTERCEPTORS.push(...interceptors);
    } else if (this.customInterceptors) {
      const interceptor = new this.customInterceptors(config, data);

      INTERCEPTORS.push(interceptor);
    }

    // Executing of interceptors
    const handlersChain = INTERCEPTORS.reduceRight(
      (next: any, interceptor: any) => new RequestHandler(next, interceptor), this.http);

    // Do request and process the answer
    return handlersChain.handle(request)
      .pipe(
        tap((event: HttpEvent<any>) => {
          if (event.type === HttpEventType.Response) {
            (this.successHandler || noop)(event, config);
          }
        }),
        map((event: HttpEvent<any>) => {
          return (event.type === HttpEventType.Response) ? event.body : event;
        }),
        tap({
          error: (err) => (this.errorHandler || noop)(err, config),
          complete: () => (this.completeHandler || noop)(config)
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


export function noop(...args: any[]) {
}
