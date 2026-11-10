/**
 * How a GET request uses saved answers (RequestConfig.cache).
 *
 * CacheFirst: the answer is kept in memory for 30 minutes and handed back
 * instead of sending the request. `cache: true` means this.
 *
 * StaleWhileRevalidate: the last saved answer is handed back at once, the
 * request is always sent, and its answer is saved and handed back too when it
 * differs. Answers are kept in the storage FS_API_CACHE_STORAGE provides
 * (provideFsApiCacheStorage() from @firestitch/api/db), across app restarts.
 */
export enum ApiCacheMode {
  CacheFirst = 'cacheFirst',
  StaleWhileRevalidate = 'staleWhileRevalidate',
}
