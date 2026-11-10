import { apiCacheSignature } from './api-cache-signature';


describe('apiCacheSignature', () => {

  it('is the same for the same query sent in another key order, at any depth', () => {
    const a = apiCacheSignature('GET', 'notes', { page: 1, filter: { tag: 'x', state: 'open' } }, 'a');
    const b = apiCacheSignature('GET', 'notes', { filter: { state: 'open', tag: 'x' }, page: 1 }, 'a');

    expect(a).toBe(b);
  });

  it('keeps the order of array items, which can mean something', () => {
    const a = apiCacheSignature('GET', 'notes', { order: ['date', 'name'] }, '');
    const b = apiCacheSignature('GET', 'notes', { order: ['name', 'date'] }, '');

    expect(a).not.toBe(b);
  });

  it('differs by method, URL, query and scope', () => {
    const base = apiCacheSignature('GET', 'notes', { page: 1 }, 'a');

    expect(apiCacheSignature('POST', 'notes', { page: 1 }, 'a')).not.toBe(base);
    expect(apiCacheSignature('GET', 'notes/1', { page: 1 }, 'a')).not.toBe(base);
    expect(apiCacheSignature('GET', 'notes', { page: 2 }, 'a')).not.toBe(base);
    expect(apiCacheSignature('GET', 'notes', { page: 1 }, 'b')).not.toBe(base);
  });

  it('treats no query as an empty one and no scope as an empty one', () => {
    expect(apiCacheSignature('GET', 'notes', undefined, undefined))
      .toBe(apiCacheSignature('GET', 'notes', {}, ''));
  });
});
