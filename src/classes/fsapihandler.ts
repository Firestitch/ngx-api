import {  HttpClient, HttpRequest, HttpHeaderResponse, HttpProgressEvent,
          HttpResponse, HttpSentEvent, HttpUserEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export class FsApiHandler {

  constructor(private http: HttpClient) {}

  handle(request: HttpRequest<any>) {
    return this.http.request(request);
  }
}
