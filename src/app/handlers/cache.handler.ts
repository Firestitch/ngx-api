import { FsApiBaseHander } from '../interfaces/handler.interface';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { RequestConfig } from '../interfaces';
import { ApiCache } from '../classes/api-cache';


export class FsApiCacheHandler implements FsApiBaseHander {

  private _cache: ApiCache;

  constructor(cache: ApiCache) {
    this._cache = cache;
  }

  success(response: HttpResponse<any>, config: RequestConfig, request: HttpRequest<any>) {
    if (request.method === 'GET') {
      if (config.cache && (request.responseType === 'json' || request.responseType === 'text')) {
        this._cache.set(request.url, config.query, response.body);
      }
    } else {
      this._cache.clear(request.url);
    }
  }

  error(error, config) {}

  complete(config) {}
}
