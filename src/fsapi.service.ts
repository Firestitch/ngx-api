import { Injectable, Inject, Optional } from '@angular/core';
import { FsUtil } from '@firestitch/common';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpRequest, HttpEvent, HttpParams, HttpEventType, HttpHeaders } from '@angular/common/http';
import * as moment from 'moment-timezone';

@Injectable()
export class FsApiConfig {
  /** A key value store for the request headers. */
  public headers?: object = {};
  public encoding?: string = 'json';
  public key?: string = null;
  public query?: object = {};

  constructor(@Optional() @Inject('FsApiConfig') private config?: any) {
    Object.assign(this, config || {});
  }

  /** Adds or overrides a header value based on the name */
  public appendHeader(name: string, value: string) {
     this.headers[name] = value;
  }
}

@Injectable()
export class FsApi {

  events = [];

  constructor(private FsApiConfig: FsApiConfig, private FsUtil: FsUtil, private http: HttpClient) {}

  public get(url, query?, config?: FsApiConfig) {
    return this.request('GET', url, query, config);
  }

  public post(url, data?: object, config?: FsApiConfig): Observable<any> {
    return this.request('POST', url, data, config);
  }

  public put(url, data?: object, config?: FsApiConfig): Observable<any> {
    return this.request('PUT', url, data, config);
  }

  public delete(url, data?: object, config?: FsApiConfig): Observable<any> {
      return this.request('DELETE', url, data, config);
  }

  public request(method: string, url: string, data?: object, config?: FsApiConfig): Observable<any> {

    config = Object.assign({}, this.FsApiConfig, config);
    method = method.toUpperCase();
    data = Object.assign({}, data);

    this.sanitize(data);

    if (method === 'GET') {
      config.query = data;
      data = {};
    }

    let headers = new HttpHeaders();
    this.FsUtil.each(config.headers, function(value, name) {
      headers = headers.set(name, value);
    });

    let hasFile = false;
    this.FsUtil.each(data, function(item) {
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
      this.FsUtil.each(data, function(item, key) {
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
    this.FsUtil.each(config.query, function(value, name) {
      params = params.append(name, value);
    });

    const request = new HttpRequest(method, url, body, {
      headers: headers,
      params: params
    });

    this.trigger('begin', request, config);

    return Observable.create(observer => {

        this.intercept(config, request, new FsApiHandler(this.http))
        .subscribe((event: HttpEvent<any>) => {
          if (event.type === HttpEventType.Sent) {
            return;
          }

          if (event.type === HttpEventType.ResponseHeader) {
            return;
          }

          if (event.type === HttpEventType.DownloadProgress) {
            const kbLoaded = Math.round(event.loaded / 1024);
            return;
          }

          if (event.type === HttpEventType.Response) {
            this.trigger('success', event, config);
            observer.next(event.body);
          }
      },
      err => {
        this.trigger('error', event, config);
        observer.error(err);
      },
      () => {
        this.trigger('complete', null, config);
        observer.complete();
      });
    });
  }

  public on(name, func) {
    this.events.push({ name: name, func: func });
    return this;
  }

  public trigger(name, data, FsApiConfig) {
    this.FsUtil.each(this.events, function(event) {
      if (name === event.name) {
        event.func(data, FsApiConfig);
      }
    });
    return this;
  }

  public intercept(config: FsApiConfig, request: HttpRequest<any>, next: FsApiHandler) {
    return next.handle(request);
  }

  private sanitize(obj) {
    const self = this;
    this.FsUtil.each(obj, function(value, key) {
      if (moment && moment.isMoment(value)) {
          obj[key] = value.format();

      } else if (value instanceof Date) {
        obj[key] = moment(value).format();

      } else if (value === undefined) {
        delete obj[key];

      } else if (self.FsUtil.isObject(value)) {
        self.sanitize(value);
      }
    });

    return obj;
  }
}

export class FsApiHandler {

  constructor(private http: HttpClient) {}

  handle(request: HttpRequest<any>) {
    console.log('FsApiHandler',request);
    return this.http.request(request);
  }
}
