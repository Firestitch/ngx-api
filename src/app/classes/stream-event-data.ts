import { StreamEventType } from '../enums';

export class StreamEventData {

  public data: any;
  public type = StreamEventType.Data;

  constructor(obj?) {
    this.data = obj?.data;
  }
}
