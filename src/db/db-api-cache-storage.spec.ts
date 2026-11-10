import { Injector, runInInjectionContext } from '@angular/core';

import { FS_API_CONFIG, IModuleConfig } from '@firestitch/api';
import { FsDb } from '@firestitch/db';

import { firstValueFrom } from 'rxjs';

import { ApiCacheStore } from './api-cache.store';
import { API_CACHE_LIFETIME, API_CACHE_MAX_ROWS, DbApiCacheStorage } from './db-api-cache-storage';


describe('DbApiCacheStorage', () => {

  let db: FsDb;

  function storage(config: IModuleConfig = {}): DbApiCacheStorage {
    db = new FsDb();

    const injector = Injector.create({
      providers: [
        { provide: FsDb, useValue: db },
        { provide: FS_API_CONFIG, useValue: config },
      ],
    });

    return runInInjectionContext(injector, () => new DbApiCacheStorage());
  }

  afterEach(async () => {
    await firstValueFrom(db.store(ApiCacheStore).destroy());
  });

  it('hands back what was saved under a signature, and nothing for another', async () => {
    const cache = storage();

    await firstValueFrom(cache.put('one', { name: 'saved', date: new Date(0) }));

    expect(await firstValueFrom(cache.get('one'))).toEqual({ name: 'saved', date: new Date(0) });
    expect(await firstValueFrom(cache.get('two'))).toBeUndefined();
  });

  it('clears every saved answer', async () => {
    const cache = storage();

    await firstValueFrom(cache.put('one', { name: 'saved' }));
    await firstValueFrom(cache.clear());

    expect(await firstValueFrom(cache.get('one'))).toBeUndefined();
  });

  it('creates and registers its store itself, with a 7 day lifetime and 500 rows', async () => {
    const cache = storage();

    await firstValueFrom(cache.get('one'));

    const store = db.store(ApiCacheStore);

    expect(store instanceof ApiCacheStore).toBe(true);
    expect(store.config.lifetime).toBe(API_CACHE_LIFETIME);
    expect(store.config.maxRows).toBe(API_CACHE_MAX_ROWS);
  });

  it('takes the lifetime and row limit from the module config', async () => {
    const cache = storage({ cacheLifetime: 1000, cacheMaxRows: 2 });

    await firstValueFrom(cache.put('one', 1));
    await firstValueFrom(cache.put('two', 2));
    await firstValueFrom(cache.put('three', 3));

    expect(db.store(ApiCacheStore).config.lifetime).toBe(1000);
    expect(await firstValueFrom(db.store(ApiCacheStore).count())).toBe(2);
  });
});
