import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { blobToBase64Url } from './blob-to-base64-url';


export function blobToBase64(blob: Blob): Observable<string> {
  return blobToBase64Url(blob)
    .pipe(
      map((data) => (data).substr((data).indexOf(',') + 1)),
    );
}
