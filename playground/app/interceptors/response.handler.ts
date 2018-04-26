import { FsApiResponseHandler } from '../../../src';
import { TestService } from '../services/test.service';

export class ResponseHandler extends FsApiResponseHandler {
  constructor(private _test: TestService) {
    super();
  }

  public success(event, config) {
    event.body = event.body.data;
    if (config.key) {
      event.body = event.body[config.key];
    }

    console.log('Success', event, this._test);
  }

  public error(err, config) {
    alert(err.statusText);
    console.log('Error', event);
  }

  public complete(config) {
    console.log('Complete');
  }
}
