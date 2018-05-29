import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { RequestInterceptor } from '../../../src';


export class TokenInterceptor extends RequestInterceptor {
  constructor(protected _config, protected _data) {
    super(_config, _data);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('begin');

    const headers = req.headers.append('api-key', '34095td98yvhs9w8dg6yd78yg0sd76gas98d67');
    const modified = req.clone({ headers: headers });

    return next.handle(modified);
  }
}
