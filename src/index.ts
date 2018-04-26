import { InjectionToken } from '@angular/core';

export * from './services';
export * from './classes';
export * from './fsapi.module';

export const API_CUSTOM_INTERCTEPTORS = new InjectionToken<any[]>('app.api_custom_iterseptors');

export const API_SUCCESS_HANDLER = new InjectionToken<any>('app.api_success_handler');
export const API_ERROR_HANDLER = new InjectionToken<any>('app.api_error_handler');
export const API_COMPLETE_HANDLER = new InjectionToken<any>('app.api_complete_handler');
