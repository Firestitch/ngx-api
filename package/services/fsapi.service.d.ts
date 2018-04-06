import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { FsApiConfig, FsApiHandler } from '../classes';
export declare class FsApi {
    private FsApiConfig;
    private http;
    events: any[];
    constructor(FsApiConfig: FsApiConfig, http: HttpClient);
    get(url: any, query?: any, config?: any): Observable<any>;
    post(url: any, data?: object, config?: any): Observable<any>;
    put(url: any, data?: object, config?: any): Observable<any>;
    delete(url: any, data?: object, config?: any): Observable<any>;
    request(method: string, url: string, data?: object, config?: any): Observable<any>;
    on(name: any, func: any): this;
    trigger(name: any, data: any, config: any): this;
    intercept(config: FsApiConfig, request: HttpRequest<any>, next: FsApiHandler): Observable<HttpEvent<{}>>;
    private sanitize(obj);
}
