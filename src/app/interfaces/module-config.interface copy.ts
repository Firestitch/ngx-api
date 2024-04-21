import { RequestMethod } from '../enums';

export interface FsApiFileConfig {
  method?: RequestMethod;
  data?: { [key: string]: any };
}
