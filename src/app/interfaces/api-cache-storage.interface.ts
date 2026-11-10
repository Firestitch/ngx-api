import { Observable } from 'rxjs';


/**
 * Where ApiCacheMode.StaleWhileRevalidate keeps answers, by request signature
 * (apiCacheSignature()). Provided through FS_API_CACHE_STORAGE; without one,
 * FsApi never saves an answer.
 */
export interface ApiCacheStorage {

  /** The saved answer, or undefined when there is none. */
  get(signature: string): Observable<any>;

  put(signature: string, body: any): Observable<void>;

  /** Removes every saved answer. */
  clear(): Observable<void>;
}
