export interface FsApiBaseHander {
  success(event, config);
  error(error, config);
  complete(config);
}

export class FsApiResponseHandler implements FsApiBaseHander {
  constructor() {}

  success(event, config) {}
  error(error, config) {}
  complete(config) {}
}
