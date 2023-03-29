import { Injectable, Optional, Inject } from '@angular/core';
import { Queue } from '@firestitch/common';
import { ResponseType } from '../enums/response-type.enum';


@Injectable()
export class FsApiConfig {
  /** A key value store for the request headers. */
  public headers?: Record<string, string | string[]> = {};
  public encoding = 'json';
  public interceptors = true;
  public handlers = true;
  public key?: string = null;
  public query?: object = {};
  public reportProgress = false;
  public responseType: ResponseType = ResponseType.Json;
  public customQueue: Queue;
  public data: any;

  constructor(@Optional() @Inject('FsApiConfig') private config?: any) {
    Object.assign(this, config || {});
  }

  /** Adds or overrides a header value based on the name */
  public appendHeader(name: string, value: string) {
     this.headers[name] = value;
  }
}
