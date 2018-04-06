export declare enum ResponseType {
    body = "body",
    httpEvent = "httpEvent",
}
export declare class FsApiConfig {
    private config;
    /** A key value store for the request headers. */
    headers?: object;
    encoding?: string;
    key?: string;
    query?: object;
    responseType: ResponseType;
    constructor(config?: any);
    /** Adds or overrides a header value based on the name */
    appendHeader(name: string, value: string): void;
}
