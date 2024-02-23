import { HttpResponse } from '@angular/common/http';

import { StreamEventType } from '../enums';

export interface StreamEventHttpResponse extends HttpResponse<any> {
  type: StreamEventType | any;
}
