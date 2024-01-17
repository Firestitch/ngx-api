
import { FsApiBaseHander } from '../interfaces/handler.interface';


export class FsApiResponseHandler implements FsApiBaseHander {

  public success(event, config): void {
    event.body = event.body.data;
    if (config.key) {
      event.body = event.body[config.key];
    }
  }

  public error(error, config): void {
    //
  }

  public complete(config): void {
    //
  }
}
