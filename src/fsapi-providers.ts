import { InjectionToken } from '@angular/core';

export const FS_API_REQUEST_INTERCEPTOR = new InjectionToken<any[]>('fs-app.request_interceptor');
export const FS_API_RESPONSE_HANDLER = new InjectionToken<any[]>('fs-app.response_handler');
