import { FsApiConfig } from '../classes/api-config';


/**
 * The key a StaleWhileRevalidate answer is saved under: the method, the URL,
 * the query, what shapes the answer that is saved (the response key, and
 * whether the body's data was unwrapped), and the scope
 * (IModuleConfig.cacheScope). The query's keys are sorted at every depth, so
 * the same query sent in another key order finds the same answer.
 */
export function apiCacheSignature(config: FsApiConfig, url: string, scope: string): string {
  return JSON.stringify([
    config.method,
    url,
    sortKeys(config.query ?? {}),
    config.key ?? null,
    config.mapHttpResponseBodyData ?? true,
    scope ?? '',
  ]);
}

function sortKeys(value: any): any {
  if (Array.isArray(value)) {
    return value.map((item) => sortKeys(item));
  }

  if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.keys(value)
      .sort()
      .reduce((sorted, key) => ({ ...sorted, [key]: sortKeys(value[key]) }), {});
  }

  return value;
}
