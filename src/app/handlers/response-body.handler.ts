
import { parse, parseLocal } from '@firestitch/date';

import { HttpResponse } from '@angular/common/http';

import { FsApiConfig } from '../classes';
import { FsApiBaseHander } from '../interfaces/handler.interface';


export class FsApiResponseBodyHandler implements FsApiBaseHander {

  public success(event: HttpResponse<any>, config: FsApiConfig): void {
    this.processData(event.body?.data);
  }

  public error(error, config: FsApiConfig): void {
    //
  }

  public complete(config: FsApiConfig): void {
    //
  }

  public processData(data): void {
    if (data instanceof Object) {
      for (const key of Object.keys(data)) {
        data[key] = this.processData(data[key]);
      }
    } else {
      if(typeof data === 'string') {
        const match = data.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|\.\d{3}Z)?$/);

        if(match) {
          data = match[1] ? parse(data) : parseLocal(data);
        }
      }
    }

    return data;
  }
}
