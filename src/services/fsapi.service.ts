import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpEventType,
  HttpXhrBackend,
  HttpEvent,
} from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import * as moment from 'moment-timezone';
import { forEach, isObject } from 'lodash';

import { FsApiConfig, RequestHandler } from '../classes';

import {
  HeadersHandlerInterceptor,
  BodyHandlerInterceptor,
  ParamsHandlerInterceptor,
  RequestReadyInterceptor
} from '../interceptors';


@Injectable()
export class FsApi {

  events = [];

  constructor(private apiConfig: FsApiConfig, private http: HttpXhrBackend) {
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

    // Describe involved intorcepters
    // Can be extended in feature for using custom interceptors from user
    const INTERCEPTORS = [
      new HeadersHandlerInterceptor(config),
      new BodyHandlerInterceptor(config, data),
      new ParamsHandlerInterceptor(config),
      new RequestReadyInterceptor(() => {
        this.trigger('begin', request, config)
      })
    ];

    // Executing of interceptors
    const handlersChain = INTERCEPTORS.reduceRight(
      (next: any, interceptor: any) => new RequestHandler(next, interceptor), this.http);

    // Do request and process the answer
    return handlersChain.handle(request)
      .pipe(
        tap((event: HttpEvent<any>) => {
          if (event.type === HttpEventType.Response) {
            this.trigger('success', event, config);
          }
        }),
        map((event: HttpEvent<any>) => {
          return (event.type === HttpEventType.Response) ? event.body : event;
        }),
        tap({
          error: (err) => this.trigger('error', err, config),
          complete: () => this.trigger('complete', {}, config)
        })
      );
  }

  /**
   * Add listener for events
   * @param name
   * @param func
   *
   * @returns {this}
   */
  public on(name, func) {
    this.events.push({ name: name, func: func });
    return this;
  }

  /**
   * Fire event
   * @param name
   * @param data
   * @param config
   *
   * @returns {this}
   */
  public trigger(name, data, config) {
    forEach(this.events, function (event) {
      if (name === event.name) {
        event.func(data, config);
      }
    });
    return this;
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
