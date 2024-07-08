import { Observable } from 'rxjs';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';


export class RequestHandler implements HttpHandler {

  constructor(
    private _next: HttpHandler, 
    private _interceptor: HttpInterceptor,
  ) {}

  public handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this._interceptor.intercept(req, this._next);
  }
}
