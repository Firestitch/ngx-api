/*
 * Public API Surface of fs-menu
 */

// Modules
export { FsApiModule } from './app/fs-api.module';

// Services
export { FsApi } from './app/services/api.service';
export { RequestHandler, CustomParamsEncoder, FsApiConfig, FsApiFile } from './app/classes';

// Providers
export { FS_API_REQUEST_INTERCEPTOR, FS_API_RESPONSE_HANDLER, FS_API_CONFIG } from './app/fs-api-providers';

// Helpers
export { makeInterceptorFactory } from './app/helpers/interceptor.factory';

// Interceptors
export { BodyHandlerInterceptor } from './app/interceptors/body-handler.interceptor';
export { ParamsHandlerInterceptor } from './app/interceptors/params-handler.interceptor';
export { HeadersHandlerInterceptor } from './app/interceptors/headers-handler.interceptor';
export { FsApiResponseHandler } from './app/handlers/response.handler';
export { FsApiResponseBodyHandler } from './app/handlers/response-body.handler';
export { RequestInterceptor } from './app/interceptors/base/request.interceptor';

// Interfaces
export { IModuleConfig } from './app/interfaces/module-config.interface';
export { RequestConfig } from './app/interfaces/request-config.interface';
export { FsApiBaseHander } from './app/interfaces/handler.interface';
export { ResponseType } from './app/enums/response-type.enum';

export { FsApiImageDirective } from './app/directives';
export { FsApiImagePipe } from './app/pipes';
