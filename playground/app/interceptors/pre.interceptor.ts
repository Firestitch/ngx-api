import { makeInterceptorFactory } from '@firestitch/api';

import { Observable } from 'rxjs';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';


class PreInterceptor implements HttpInterceptor {

  constructor(
    public config, 
    public data, 
  ) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req);
  }
}

export const PreInterceptorFactory = makeInterceptorFactory(PreInterceptor);
