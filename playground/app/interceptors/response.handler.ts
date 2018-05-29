import { FsApiResponseHandler } from '../../../src';
import { TestService } from '../services/test.service';

export class ResponseHandler extends FsApiResponseHandler {
  constructor(private _test: TestService) {
    super();
  }

  public success(event, config) {
    super.success(event, config);
    
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
