import { Injector, runInInjectionContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { firstValueFrom, lastValueFrom, of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';

import { HttpErrorResponse, HttpRequest, HttpResponse, HttpXhrBackend } from '@angular/common/http';

import { ApiCacheMode, ResponseType } from '../enums';
import { FS_API_CACHE_STORAGE, FS_API_CONFIG } from '../fs-api-injectors';
import { IModuleConfig } from '../interfaces';
import { MemoryApiCacheStorage } from '../testing/memory-api-cache-storage';

import { FsApi } from './api.service';


describe('FsApi cache', () => {

  let storage: MemoryApiCacheStorage;
  let answers: any[];
  let requests: HttpRequest<any>[];
  let fail: boolean;

  // The server: answers each request with the next of `answers` as its data,
  // or with a 500 while `fail` is set.
  const backend = {
    handle: (request: HttpRequest<any>) => {
      requests.push(request);

      if (fail) {
        return throwError(() => new HttpErrorResponse({ status: 500, url: request.url }));
      }

      return of(new HttpResponse({ body: { data: answers.shift() }, status: 200, url: request.url }));
    },
  };

  function api(config: IModuleConfig = {}, withStorage = true): FsApi {
    const injector = Injector.create({
      providers: [
        { provide: HttpXhrBackend, useValue: backend },
        { provide: DomSanitizer, useValue: {} },
        { provide: FS_API_CONFIG, useValue: config },
        ...(withStorage ? [{ provide: FS_API_CACHE_STORAGE, useValue: storage }] : []),
      ],
    });

    return runInInjectionContext(injector, () => new FsApi());
  }

  beforeEach(() => {
    storage = new MemoryApiCacheStorage();
    answers = [];
    requests = [];
    fail = false;
  });

  describe('ApiCacheMode.StaleWhileRevalidate', () => {

    it('answers a repeated GET with the saved answer first, then the server\'s new one', async () => {
      const fsApi = api();
      const cache = ApiCacheMode.StaleWhileRevalidate;

      answers = [{ notes: ['a'] }, { notes: ['a', 'b'] }];

      expect(await lastValueFrom(fsApi.get('notes', { page: 1 }, { cache }).pipe(toArray())))
        .toEqual([{ notes: ['a'] }]);
      expect(await lastValueFrom(fsApi.get('notes', { page: 1 }, { cache }).pipe(toArray())))
        .toEqual([{ notes: ['a'] }, { notes: ['a', 'b'] }]);
      expect(requests.length).toBe(2);
    });

    it('keeps one scope\'s answers from another', async () => {
      let scope = 'one';
      const fsApi = api({ cacheScope: () => scope });
      const cache = ApiCacheMode.StaleWhileRevalidate;

      answers = [{ name: 'one' }, { name: 'two' }];

      await lastValueFrom(fsApi.get('profile', {}, { cache }));
      scope = 'two';

      expect(await lastValueFrom(fsApi.get('profile', {}, { cache }).pipe(toArray())))
        .toEqual([{ name: 'two' }]);
    });

    it('fails with how to turn it on when no storage is provided', async () => {
      const fsApi = api({}, false);

      const error = await firstValueFrom(fsApi.get('notes', {}, { cache: ApiCacheMode.StaleWhileRevalidate }))
        .catch((e) => e);

      expect(error.message).toContain('provideFsApiCacheStorage');
      expect(requests.length).toBe(0);
    });

    it('leaves a request that does not answer with a JSON body alone', async () => {
      const fsApi = api();

      answers = ['file'];

      await lastValueFrom(fsApi.get('notes', {}, {
        cache: ApiCacheMode.StaleWhileRevalidate,
        responseType: ResponseType.Text,
      }));

      expect(storage.gets + storage.puts).toBe(0);
    });
  });

  describe('a save', () => {

    it('clears every saved answer once it succeeds', async () => {
      const fsApi = api();

      storage.rows.set('saved', '{}');
      answers = [{ id: 1 }];

      expect(await lastValueFrom(fsApi.post('notes', { name: 'note' }))).toEqual({ id: 1 });
      expect(storage.rows.size).toBe(0);
    });

    it('leaves them when it fails', async () => {
      const fsApi = api();

      storage.rows.set('saved', '{}');
      fail = true;

      await lastValueFrom(fsApi.put('notes/1', { name: 'note' })).catch(() => null);

      expect(storage.rows.size).toBe(1);
    });

    it('needs no storage', async () => {
      const fsApi = api({}, false);

      answers = [{ id: 1 }];

      expect(await lastValueFrom(fsApi.delete('notes/1'))).toEqual({ id: 1 });
    });
  });

  describe('cache: true', () => {

    it('never reads or writes the saved answers', async () => {
      const fsApi = api();

      answers = [{ name: 'a' }, { name: 'a' }];

      await lastValueFrom(fsApi.get('notes', {}, { cache: true }));
      await lastValueFrom(fsApi.get('notes', {}, { cache: true }));

      expect(storage.gets + storage.puts + storage.clears).toBe(0);
    });
  });
});
