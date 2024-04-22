import { Injectable } from '@angular/core';

import { FsApi, RequestConfig } from '@firestitch/api';

import { Observable } from 'rxjs';


@Injectable()
export class NewFsApi extends FsApi {

  public file(method, url: string, data = null, requestConfig: RequestConfig = null): Observable<File> {
    return super.file(method, url, data, requestConfig);
  }
}
