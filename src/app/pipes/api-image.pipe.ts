import { Pipe, PipeTransform } from '@angular/core';

import { FsApi } from '../services';
import { DomSanitizer } from '@angular/platform-browser';
import { delay, map } from 'rxjs/operators';


@Pipe({
  name: 'fsApiImage',
})
export class FsApiImagePipe implements PipeTransform {
  
  public constructor(
    private _api: FsApi,
    private _sanitizer: DomSanitizer,
  ) {
  }

  public transform(url: string) {    
    return this._api.createApiFile(url)
      .safeDataUrl;
  }
}
