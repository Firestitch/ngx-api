import { RequestInterceptor, makeInterceptorFactory } from '@firestitch/api';

import { Observable } from 'rxjs';

import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';


class TokenInterceptor extends RequestInterceptor {
  constructor(protected _config, protected _data) {
    super(_config, _data);
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('begin');

    const headers = req.headers.append('api-key', '34095td98yvhs9w8dg6yd78yg0sd76gas98d67');
    const modified = req.clone({ headers });

    return next.handle(modified);
  }
}

export const TokenInterceptorFactory = makeInterceptorFactory(TokenInterceptor);
