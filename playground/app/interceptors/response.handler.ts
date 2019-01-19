import { FsMessage } from '@firestitch/message';
import { FsApiResponseHandler } from '@firestitch/api';

export class ResponseHandler extends FsApiResponseHandler {

  protected fsMessage;
  constructor(fsMessage: FsMessage) {
    super();
    this.fsMessage = fsMessage;
  }

  public success(event, config) {
    super.success(event, config);
    this.fsMessage.success('Successful API call');
  }

  public error(err, config) {
    this.fsMessage.error(err.statusText, { mode: 'toast' });
  }

  public complete(config) {
    console.log('Complete');
  }
}
