import { Injectable, Inject, Optional } from '@angular/core';
import { FsUtil } from '@firestitch/common';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpRequest, HttpEvent, HttpParams, HttpEventType, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment-timezone';
import { FsApiConfig, FsApiHandler, ResponseType } from '../classes';
import { forEach, isObject } from 'lodash';

@Injectable()
export class FsApi {

  events = [];

  constructor(private FsApiConfig: FsApiConfig, private http: HttpClient) {}

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

    config = <FsApiConfig>Object.assign({}, this.FsApiConfig, config);
    method = method.toUpperCase();
    data = Object.assign({}, data);

    this.sanitize(data);

    if (method === 'GET') {
      config.query = data;
      data = {};
    }

    let headers = new HttpHeaders();
    forEach(config.headers, function(value, name) {
      headers = headers.set(name, value);
    });

    let hasFile = false;
    forEach(data, function(item) {
       if (item instanceof File || item instanceof Blob) {
        hasFile = true;
        config.encoding = 'formdata';
      }
    });

    let body = null;
    if (config.encoding === 'url') {
      headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
      body = data;

    } else if (config.encoding === 'json') {
      headers = headers.set('Content-Type', 'text/json');
      body = JSON.stringify(data);

    } else if (config.encoding === 'formdata') {
      headers = headers.delete('Content-Type');
      body = new FormData();
      forEach(data, function(item, key) {
        if (item != null && item.name) {
          body.append(key, item, item.name);
        } else {
          body.append(key, item);
        }
      });
    }

    //begin(request, headers, config);

    // var timeout = config.uploadTimeout;
    //   var slowTimeout = null;

    //     if(!hasFile) {
    //       timeout = config.timeout;
    //       if(config.slowTimeout) {
    //         slowTimeout = setTimeout(function() {
    //           fsAlert.info('Your request is still processing, please wait...',{ hideDelay: 0, toastClass: 'fs-api-slow-timeout' });
    //         },config.slowTimeout * 1000);
    //     }
    //if(url.match(/^http/)) {


   // let url = config.url + url;
    // if(config.forceHttps && !url.match(/^https/)) {

    //   if(url.match(/^http/)) {
    //     url = url.replace(/^https/,'https');
    //   } else {
    //     url = 'https://' + $location.$$host + ($location.$$port==80 ? '' : ':' + $location.$$port) + url;
    //   }
    // }

    let params = new HttpParams();
    forEach(config.query, function(value, name) {
      params = params.append(name, value);
    });

    const request = new HttpRequest(method, url, body, {
      headers: headers,
      params: params,
      reportProgress: config.reportProgress
    });

    if (config.reportProgress) {
      config.responseType = ResponseType.httpEvent;
    }

    this.trigger('begin', request, config);
    let httpObservable = null;
    return new Observable(observer => {
        httpObservable = this.intercept(config, request, new FsApiHandler(this.http))
        .subscribe((event: HttpEvent<any>) => {

          if (config.responseType == ResponseType.httpEvent) {
            observer.next(event);

          } else if (event.type === HttpEventType.Response) {
            this.trigger('success', event, config);
            observer.next(event.body);
          }
        },
        err => {
          this.trigger('error', err, config);
          observer.error(err);
        },
        () => {
          this.trigger('complete', {}, config);
          observer.complete();
        });

        return {
          unsubscribe() {
            httpObservable.unsubscribe();
          }
        };
    });
  }

  public on(name, func) {
    this.events.push({ name: name, func: func });
    return this;
  }

  public trigger(name, data, config) {
    forEach(this.events, function(event) {
      if (name === event.name) {
        event.func(data, config);
      }
    });
    return this;
  }

  public intercept(config: FsApiConfig, request: HttpRequest<any>, next: FsApiHandler) {
    return next.handle(request);
  }

  private sanitize(obj) {
    const self = this;
    forEach(obj, function(value, key) {
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
