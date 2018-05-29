import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public mainModule = 
`import {
  FsApiModule,
  FS_API_REQUEST_INTERCEPTOR,
  FS_API_RESPONSE_HANDLER,
} from '@firestitch/api';
import { AlertInterceptor, TokenInterceptor } from './app/interceptors';
import { ResponseHandler } from './app/interceptors/response.handler';  


@NgModule({
  imports: [
    FsApiModule
  ]
  providers: [
    { provide: FS_API_REQUEST_INTERCEPTOR, useValue: AlertInterceptor, multi: true },
    { provide: FS_API_REQUEST_INTERCEPTOR, useValue: TokenInterceptor, multi: true },
    { provide: FS_API_RESPONSE_HANDLER, useClass: ResponseHandler },
  ],
});`;

  public alertInterceptor =
`import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RequestInterceptor } from '@firestitch/api';


export class AlertInterceptor extends RequestInterceptor {
  constructor(protected _config, protected _data) {
    super(_config, _data);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    alert('Has been intercepted');
    return next.handle(req);
  }
}`;

  public tokenInterceptor = 
`import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RequestInterceptor } from '@firestitch/api';


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
}`;

  public responseHandler = 
`import { FsApiResponseHandler } from '@firestitch/api';

export class ResponseHandler extends FsApiResponseHandler {
  constructor() {
    super();
  }

  public success(event, config) {
    super.success(event, config);
    
    console.log('Success', event);
  }

  public error(err, config) {
    alert(err.statusText);
    console.log('Error', event);
  }

  public complete(config) {
    console.log('Complete');
  }
}`;
}
