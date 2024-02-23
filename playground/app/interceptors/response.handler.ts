import { FsApiResponseHandler } from '@firestitch/api';
import { FsMessage, MessageMode } from '@firestitch/message';

export class ResponseHandler extends FsApiResponseHandler {

  constructor(
    private _message: FsMessage) {
    super();
  }

  public success(event, config) {
    super.success(event, config);
    this._message.success('Successful API call');
  }

  public error(err, config) {
    this._message.error(err.message || err.statusText, { mode: MessageMode.Toast });
  }

  public complete(config) {
    console.log('Complete');
  }
}
