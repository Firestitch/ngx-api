export interface FsApiBaseHander {
  success(event, config);
  error(error, config);
  complete(config);
}

export class FsApiResponseHandler implements FsApiBaseHander {
  constructor() {}

  success(event, config) {
    event.body = event.body.data;
    if (config.key) {
      event.body = event.body[config.key];
    }
  }
  error(error, config) {}
  complete(config) {}
}
