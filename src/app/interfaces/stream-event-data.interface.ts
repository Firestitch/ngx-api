import { StreamEventType } from '../enums';

export interface StreamEventData {
  data: any;
  type: StreamEventType;
}
