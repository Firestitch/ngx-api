import { HttpClient, HttpRequest, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpSentEvent, HttpUserEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
export declare class FsApiHandler {
    private http;
    constructor(http: HttpClient);
    handle(request: HttpRequest<any>): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<{}> | HttpUserEvent<{}>>;
}
