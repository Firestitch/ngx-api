import { Observable, Subject, firstValueFrom, lastValueFrom, of, throwError } from 'rxjs';
import { toArray } from 'rxjs/operators';

import { MemoryApiCacheStorage } from '../testing/memory-api-cache-storage';

import { staleWhileRevalidate } from './stale-while-revalidate';


describe('staleWhileRevalidate', () => {

  const signature = 'sig';
  let storage: MemoryApiCacheStorage;

  function emitted<T>(request$: Observable<T>): Promise<T[]> {
    return lastValueFrom(staleWhileRevalidate(storage, signature, request$).pipe(toArray()));
  }

  beforeEach(() => {
    storage = new MemoryApiCacheStorage();
  });

  it('with nothing saved is the plain request, and saves its answer', async () => {
    expect(await emitted(of({ name: 'fresh' }))).toEqual([{ name: 'fresh' }]);
    expect(JSON.parse(storage.rows.get(signature))).toEqual({ name: 'fresh' });
  });

  it('hands on the saved answer first, then the server\'s when it differs', async () => {
    storage.rows.set(signature, JSON.stringify({ name: 'saved' }));

    expect(await emitted(of({ name: 'fresh' }))).toEqual([{ name: 'saved' }, { name: 'fresh' }]);
    expect(JSON.parse(storage.rows.get(signature))).toEqual({ name: 'fresh' });
  });

  it('hands on the saved answer alone when the server\'s is the same', async () => {
    storage.rows.set(signature, JSON.stringify({ name: 'same' }));

    expect(await emitted(of({ name: 'same' }))).toEqual([{ name: 'same' }]);
    expect(storage.puts).toBe(1);
  });

  it('sends the request without waiting for the saved answer', async () => {
    let sent = false;
    const request$ = new Observable<any>((subscriber) => {
      sent = true;
      subscriber.next({ name: 'fresh' });
      subscriber.complete();
    });

    storage.get = () => new Subject<any>();

    const first = firstValueFrom(staleWhileRevalidate(storage, signature, request$));

    expect(sent).toBe(true);
    expect(await first).toEqual({ name: 'fresh' });
  });

  it('drops a saved answer read after the server answered', async () => {
    const saved$ = new Subject<any>();
    const request$ = new Subject<any>();

    storage.get = () => saved$;

    const result = lastValueFrom(staleWhileRevalidate(storage, signature, request$).pipe(toArray()));

    request$.next({ name: 'fresh' });
    request$.complete();
    saved$.next({ name: 'saved' });
    saved$.complete();

    expect(await result).toEqual([{ name: 'fresh' }]);
  });

  it('still fails when the request fails, after handing on the saved answer', async () => {
    const values = [];
    storage.rows.set(signature, JSON.stringify({ name: 'saved' }));

    const error = await new Promise((resolve) => {
      staleWhileRevalidate(storage, signature, throwError(() => new Error('offline')))
        .subscribe({ next: (value) => values.push(value), error: resolve });
    });

    expect(values).toEqual([{ name: 'saved' }]);
    expect((error as Error).message).toBe('offline');
  });

  it('treats a storage that cannot be read or written as nothing saved', async () => {
    storage.get = () => throwError(() => new Error('blocked'));
    storage.put = () => throwError(() => new Error('blocked'));

    expect(await emitted(of({ name: 'fresh' }))).toEqual([{ name: 'fresh' }]);
  });

  it('saves before handing on, so a change made to the answer is not saved', async () => {
    const answer = await firstValueFrom(staleWhileRevalidate(storage, signature, of({ name: 'fresh' })));

    answer.name = 'changed';

    expect(JSON.parse(storage.rows.get(signature))).toEqual({ name: 'fresh' });
  });
});
