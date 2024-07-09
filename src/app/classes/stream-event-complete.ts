import { StreamEventType } from '../enums';

export class StreamEventComplete {

  public data: any;
  public code: number;
  public type = StreamEventType.Complete;

  constructor(obj?) {
    this.data = obj?.data;
    this.code = obj?.code;
  }
}
