import { InjectionToken } from '@angular/core';

export const FS_API_REQUEST_INTERCEPTOR = new InjectionToken<any[]>('fs-api.request_interceptor');
export const FS_API_PRE_REQUEST_INTERCEPTOR = new InjectionToken<any[]>('fs-api.pre_request_interceptor');
export const FS_API_RESPONSE_HANDLER = new InjectionToken<any[]>('fs-api.response_handler');
export const FS_API_CONFIG = new InjectionToken<any[]>('fs-api.config');
