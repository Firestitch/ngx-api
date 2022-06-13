
import { parse, parseLocal } from '@firestitch/date';

import { FsApiBaseHander } from '../interfaces/handler.interface';


export class FsApiResponseBodyHandler implements FsApiBaseHander {

  public success(event, config): void {
    this.processData(event.body.data);
  }

  public error(error, config): void {}

  public complete(config): void {}

  public processData(data): void {
    if(data instanceof Object) {
      for (const key of Object.keys(data)) {
        data[key] = this.processData(data[key]);
      }
    } else {
      if(typeof data === 'string') {
        const match = data.match(/\d{4}-\d{2}-\d{2}(.*)/);

        if(match) {
          data = match[1] ? parse(data) : parseLocal(data);
        }
      }
    }

    return data;    
  }
}
