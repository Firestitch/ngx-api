import { FsUtil } from '@firestitch/common';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
export declare class FsApiConfig {
    private config;
    /** A key value store for the request headers. */
    headers?: object;
    encoding?: string;
    key?: string;
    query?: object;
    constructor(config?: any);
    /** Adds or overrides a header value based on the name */
    appendHeader(name: string, value: string): void;
}
export declare class FsApi {
    private FsApiConfig;
    private FsUtil;
    private http;
    events: any[];
    constructor(FsApiConfig: FsApiConfig, FsUtil: FsUtil, http: HttpClient);
    get(url: any, query?: any, config?: FsApiConfig): Observable<any>;
    post(url: any, data?: object, config?: FsApiConfig): Observable<any>;
    put(url: any, data?: object, config?: FsApiConfig): Observable<any>;
    delete(url: any, data?: object, config?: FsApiConfig): Observable<any>;
    request(method: string, url: string, data?: object, config?: FsApiConfig): Observable<any>;
    on(name: any, func: any): this;
    trigger(name: any, data: any, FsApiConfig: any): this;
    intercept(config: FsApiConfig, request: HttpRequest<any>, next: FsApiHandler): Observable<HttpEvent<{}>>;
    private sanitize(obj);
}
export declare class FsApiHandler {
    private http;
    constructor(http: HttpClient);
    handle(request: HttpRequest<any>): Observable<HttpEvent<{}>>;
}
