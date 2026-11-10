import { InjectionToken } from '@angular/core';

import { ApiCacheStorage } from './interfaces/api-cache-storage.interface';

export const FS_API_REQUEST_INTERCEPTOR = new InjectionToken<any[]>('fs-api.request_interceptor');
export const FS_API_PRE_REQUEST_INTERCEPTOR = new InjectionToken<any[]>('fs-api.pre_request_interceptor');
export const FS_API_PRE_RESPONSE_INTERCEPTOR = new InjectionToken<any[]>('fs-api.pre_response_interceptor');
export const FS_API_RESPONSE_HANDLER = new InjectionToken<any[]>('fs-api.response_handler');
export const FS_API_CONFIG = new InjectionToken<any[]>('fs-api.config');

/**
 * Where ApiCacheMode.StaleWhileRevalidate keeps answers. Optional: without it,
 * no answer is saved and a save clears nothing. provideFsApiCacheStorage()
 * from @firestitch/api/db provides the IndexedDB one.
 */
export const FS_API_CACHE_STORAGE = new InjectionToken<ApiCacheStorage>('fs-api.cache_storage');
