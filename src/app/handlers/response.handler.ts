import { FsApiBaseHander } from '../interfaces/handler.interface';


export class FsApiResponseHandler implements FsApiBaseHander {

  success(event, config) {
    event.body = event.body.data;
    if (config.key) {
      event.body = event.body[config.key];
    }
  }
  error(error, config) {
    debugger;
  }
  complete(config) {}
}
