import { Provider } from '@angular/core';

import { FS_API_CACHE_STORAGE } from '@firestitch/api';

import { DbApiCacheStorage } from './db-api-cache-storage';


/**
 * Turns on ApiCacheMode.StaleWhileRevalidate: answers are saved in IndexedDB,
 * and any successful request that is not a GET clears them. Lifetime and row
 * limit come from IModuleConfig (cacheLifetime, cacheMaxRows), the scope from
 * IModuleConfig.cacheScope.
 */
export function provideFsApiCacheStorage(): Provider {
  return { provide: FS_API_CACHE_STORAGE, useClass: DbApiCacheStorage };
}
