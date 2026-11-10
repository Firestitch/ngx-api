/**
 * The key a StaleWhileRevalidate answer is saved under: the method, the URL,
 * the query and the scope (IModuleConfig.cacheScope). The query's keys are
 * sorted at every depth, so the same query sent in another key order finds the
 * same answer.
 */
export function apiCacheSignature(method: string, url: string, query: any, scope: string): string {
  return JSON.stringify([method, url, sortKeys(query ?? {}), scope ?? '']);
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
