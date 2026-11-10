import { Observable, defer, of } from 'rxjs';

import { ApiCacheStorage } from '../interfaces/api-cache-storage.interface';


/**
 * An ApiCacheStorage in a Map, for specs. Copies on the way in and out like a
 * real storage, and counts what was asked of it.
 */
export class MemoryApiCacheStorage implements ApiCacheStorage {

  public rows = new Map<string, string>();
  public gets = 0;
  public puts = 0;
  public clears = 0;

  public get(signature: string): Observable<any> {
    return defer(() => {
      this.gets++;

      return of(this.rows.has(signature) ? JSON.parse(this.rows.get(signature)) : undefined);
    });
  }

  public put(signature: string, body: any): Observable<void> {
    return defer(() => {
      this.puts++;
      this.rows.set(signature, JSON.stringify(body));

      return of(null);
    });
  }

  public clear(): Observable<void> {
    return defer(() => {
      this.clears++;
      this.rows.clear();

      return of(null);
    });
  }

}
