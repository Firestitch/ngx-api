import { Injectable, Optional, Inject } from '@angular/core';

export enum ResponseType {
  body = 'body',
  httpEvent = 'httpEvent'
}

@Injectable()
export class FsApiConfig {
  /** A key value store for the request headers. */
  public headers?: object = {};
  public encoding? = 'json';
  public key?: string = null;
  public query?: object = {};
  public responseType: ResponseType = ResponseType.body;

  constructor(@Optional() @Inject('FsApiConfig') private config?: any) {
    Object.assign(this, config || {});
  }

  /** Adds or overrides a header value based on the name */
  public appendHeader(name: string, value: string) {
     this.headers[name] = value;
  }
}
