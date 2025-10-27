import { Pipe, PipeTransform, inject } from '@angular/core';

import { FsApi } from '../services';
import { DomSanitizer } from '@angular/platform-browser';
import { delay, map } from 'rxjs/operators';


@Pipe({
    name: 'fsApiImage',
    standalone: true,
})
export class FsApiImagePipe implements PipeTransform {
  private _api = inject(FsApi);
  private _sanitizer = inject(DomSanitizer);


  public transform(url: string) {    
    return this._api.createApiFile(url)
      .safeDataUrl;
  }
}
