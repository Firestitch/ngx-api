import { RequestMethod } from '../enums';

import { RequestConfig } from './request-config.interface';

export interface FsApiFileConfig {
  name?: string;
  method?: RequestMethod;
  data?: { [key: string]: any };
  requestConfig?: RequestConfig;
}
