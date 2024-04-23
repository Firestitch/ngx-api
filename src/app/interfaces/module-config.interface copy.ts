import { RequestMethod } from '../enums';

export interface FsApiFileConfig {
  name?: string;
  method?: RequestMethod;
  data?: { [key: string]: any };
}
