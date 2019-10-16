import { differenceInMinutes } from 'date-fns'


export class ApiCache {

  private _cache = Array();

  public get(name, params) {
    const cache = this._cache[name];

    if (!cache) {
      return null;
    }

    const paramHash = this._paramHash(params);
    const data = cache[paramHash];

    if (data) {
      if (differenceInMinutes(new Date(), data.date.getTime()) > 30) {
        delete this._cache[name][paramHash];
      }

      return data.data;
    }

    return null;
  }

  public set(name, params, data) {

    if (!this._cache[name]) {
      this._cache[name] = [];
    }

    this._cache[name][this._paramHash(params)] = { data: data, date: new Date() };
  }

  public clear(name) {
    Object.keys(this._cache).forEach(key => {
      if (name.match(new RegExp(`^${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`))) {
        delete this._cache[key];
      }
    });
  }

  private _paramHash(params) {
    return JSON.stringify(params);
  }
}
