import { Store } from '@firestitch/db';

import { ApiCacheRow } from './api-cache-row';


/**
 * The IndexedDB table StaleWhileRevalidate answers are saved in, one row per
 * request signature. Its lifetime and row limit are set where it is created
 * (DbApiCacheStorage).
 */
export class ApiCacheStore extends Store<ApiCacheRow> {

  public static storeName = 'fsApiCache';
  public static keyName = 'signature';

}
