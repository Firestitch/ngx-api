import { FsApiConfig } from '../classes/api-config';
import { RequestConfig } from '../interfaces';

import { apiCacheSignature } from './api-cache-signature';


describe('apiCacheSignature', () => {

  function signature(
    query: any,
    { method = 'GET', url = 'notes', scope = 'a', config = {} }:
    { method?: string; url?: string; scope?: string; config?: RequestConfig } = {},
  ): string {
    return apiCacheSignature(new FsApiConfig(config, method, query), url, scope);
  }

  it('is the same for the same query sent in another key order, at any depth', () => {
    expect(signature({ page: 1, filter: { tag: 'x', state: 'open' } }))
      .toBe(signature({ filter: { state: 'open', tag: 'x' }, page: 1 }));
  });

  it('keeps the order of array items, which can mean something', () => {
    expect(signature({ order: ['date', 'name'] }))
      .not.toBe(signature({ order: ['name', 'date'] }));
  });

  it('differs by method, URL, query and scope', () => {
    const base = signature({ page: 1 });

    expect(signature({ page: 1 }, { method: 'POST' })).not.toBe(base);
    expect(signature({ page: 1 }, { url: 'notes/1' })).not.toBe(base);
    expect(signature({ page: 2 })).not.toBe(base);
    expect(signature({ page: 1 }, { scope: 'b' })).not.toBe(base);
  });

  it('differs by what shapes the saved answer: the response key and data unwrapping', () => {
    const base = signature({ page: 1 });

    expect(signature({ page: 1 }, { config: { key: 'notes' } })).not.toBe(base);
    expect(signature({ page: 1 }, { config: { mapHttpResponseBodyData: false } })).not.toBe(base);
  });

  it('treats no query as an empty one and no scope as an empty one', () => {
    expect(apiCacheSignature(new FsApiConfig({}, 'GET', undefined), 'notes', undefined))
      .toBe(apiCacheSignature(new FsApiConfig({}, 'GET', {}), 'notes', ''));
  });
});
