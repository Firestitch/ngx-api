/** One saved answer: the request's signature (apiCacheSignature()) and the body it answered. */
export interface ApiCacheRow {
  signature: string;
  body: any;
}
