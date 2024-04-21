import { Observable } from 'rxjs';

export function blobToBase64Url(blob: Blob): Observable<string> {
  return new Observable<string>((observer) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onload = () => {
      observer.next(reader.result as string);
      observer.complete();
    };
    reader.onerror = (error) => observer.error(error);
  });
}
