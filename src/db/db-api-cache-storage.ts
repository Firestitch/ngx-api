import { Injectable, inject } from '@angular/core';

import { ApiCacheStorage, FS_API_CONFIG, IModuleConfig } from '@firestitch/api';
import { FsDb } from '@firestitch/db';

import { Observable } from 'rxjs';
import { map, shareReplay, switchMap } from 'rxjs/operators';

import { ApiCacheRow } from './api-cache-row';
import { ApiCacheStore } from './api-cache.store';


/** How long an answer is kept after it was last saved, unless IModuleConfig.cacheLifetime says otherwise. */
export const API_CACHE_LIFETIME = 7 * 24 * 60 * 60 * 1000;

/** How many answers are kept, unless IModuleConfig.cacheMaxRows says otherwise. */
export const API_CACHE_MAX_ROWS = 500;

/**
 * StaleWhileRevalidate's answers in IndexedDB, in an ApiCacheStore.
 *
 * SELF-CONTAINED: the store is created, registered with FsDb and initialized
 * the first time an answer is read, saved or cleared, once, so an app adds
 * the provider and nothing else. Initializing it is also what deletes the
 * answers past their lifetime.
 */
@Injectable()
export class DbApiCacheStorage implements ApiCacheStorage {

  private _db = inject(FsDb);
  private _config = inject<IModuleConfig>(FS_API_CONFIG, { optional: true });
  private _store$: Observable<ApiCacheStore>;

  public get(signature: string): Observable<any> {
    return this._store()
      .pipe(
        switchMap((store) => store.get(signature)),
        map((row: ApiCacheRow) => row?.body),
      );
  }

  public put(signature: string, body: any): Observable<void> {
    return this._store()
      .pipe(
        switchMap((store) => store.put({ signature, body })),
      );
  }

  public clear(): Observable<void> {
    return this._store()
      .pipe(
        switchMap((store) => store.clear()),
      );
  }

  private _store(): Observable<ApiCacheStore> {
    if (!this._store$) {
      const store = new ApiCacheStore({
        lifetime: this._config?.cacheLifetime ?? API_CACHE_LIFETIME,
        maxRows: this._config?.cacheMaxRows ?? API_CACHE_MAX_ROWS,
      });

      this._db.register(store);
      this._store$ = store.init()
        .pipe(
          map(() => store),
          shareReplay(1),
        );
    }

    return this._store$;
  }

}
