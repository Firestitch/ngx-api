import { HttpRequest, HttpResponse } from '@angular/common/http';

import { ApiCache } from '../classes/api-cache';
import { FsApiConfig } from '../classes/api-config';
import { FsApiBaseHander } from '../interfaces/handler.interface';


export class FsApiCacheHandler implements FsApiBaseHander {

  private _cache: ApiCache;

  constructor(cache: ApiCache) {
    this._cache = cache;
  }

  public success(response: HttpResponse<any>, config: FsApiConfig, request: HttpRequest<any>) {
    if (request.method === 'GET') {
      if (config.cacheFirst && (request.responseType === 'json' || request.responseType === 'text')) {
        this._cache.set(request.url, config.query, response.body);
      }
    } else {
      this._cache.clear(request.url);
    }
  }

  public error(error, config) {
    //
  }

  public complete(config) {
    //
  }
}
