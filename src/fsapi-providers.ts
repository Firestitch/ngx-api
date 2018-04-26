import { InjectionToken } from '@angular/core';

export const FS_API_REQUEST_INTERCEPTORS = new InjectionToken<any[]>('fs-app.request_interceptors');
export const FS_API_RESPONSE_HANDLER = new InjectionToken<any[]>('fs-app.response_handler');
