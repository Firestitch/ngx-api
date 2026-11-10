import { EMPTY, Observable, concat, defer, merge, of } from 'rxjs';
import { catchError, concatMap, filter, ignoreElements, tap } from 'rxjs/operators';

import { ApiCacheStorage } from '../interfaces/api-cache-storage.interface';


/**
 * ApiCacheMode.StaleWhileRevalidate around one GET.
 *
 * The request goes out at once, never waiting on the storage. The saved
 * answer, when there is one and it is read before the server answers, is
 * handed on first. The server's answer is saved, then handed on only when it
 * differs from what was handed on (compared as JSON), so an unchanged answer
 * costs the subscriber nothing. With nothing saved this is the plain request
 * plus a save.
 *
 * Saved before it is handed on: storage takes a copy then, so nothing the
 * subscriber does to the answer reaches what is saved, and a save request
 * that clears the storage after this answer arrived cannot be undone by it.
 *
 * A storage that cannot be read or written is no saved answer and no save. A
 * failed request still fails, after the saved answer was handed on.
 */
export function staleWhileRevalidate<T>(
  storage: ApiCacheStorage,
  signature: string,
  request$: Observable<T>,
): Observable<T> {
  return defer(() => {
    let handedOn: string = null;
    let answered = false;

    const saved$ = storage.get(signature)
      .pipe(
        catchError(() => of(undefined)),
        filter((saved) => saved !== undefined && !answered),
        tap((saved) => {
          handedOn = JSON.stringify(saved);
        }),
      );

    const answer$ = request$
      .pipe(
        tap(() => {
          answered = true;
        }),
        concatMap((body: T) => concat(
          storage.put(signature, body)
            .pipe(
              ignoreElements(),
              catchError(() => EMPTY),
            ),
          of(body),
        )),
        filter((body: T) => JSON.stringify(body) !== handedOn),
      );

    return merge(saved$, answer$);
  });
}
