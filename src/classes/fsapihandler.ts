import { HttpClient, HttpRequest } from '@angular/common/http';

export class FsApiHandler {

  constructor(private http: HttpClient) {}

  handle(request: HttpRequest<any>) {
    return this.http.request(request);
  }
}
