"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var http_1 = require("@angular/common/http");
var moment = require("moment-timezone");
var classes_1 = require("../classes");
var lodash_1 = require("lodash");
var FsApi = (function () {
    function FsApi(FsApiConfig, http) {
        this.FsApiConfig = FsApiConfig;
        this.http = http;
        this.events = [];
    }
    FsApi.prototype.get = function (url, query, config) {
        return this.request('GET', url, query, config);
    };
    FsApi.prototype.post = function (url, data, config) {
        return this.request('POST', url, data, config);
    };
    FsApi.prototype.put = function (url, data, config) {
        return this.request('PUT', url, data, config);
    };
    FsApi.prototype.delete = function (url, data, config) {
        return this.request('DELETE', url, data, config);
    };
    FsApi.prototype.request = function (method, url, data, config) {
        var _this = this;
        config = Object.assign({}, this.FsApiConfig, config);
        method = method.toUpperCase();
        data = Object.assign({}, data);
        this.sanitize(data);
        if (method === 'GET') {
            config.query = data;
            data = {};
        }
        var headers = new http_1.HttpHeaders();
        lodash_1.forEach(config.headers, function (value, name) {
            headers = headers.set(name, value);
        });
        var hasFile = false;
        lodash_1.forEach(data, function (item) {
            if (item instanceof File || item instanceof Blob) {
                hasFile = true;
                config.encoding = 'formdata';
            }
        });
        var body = null;
        if (config.encoding === 'url') {
            headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
            body = data;
        }
        else if (config.encoding === 'json') {
            headers = headers.set('Content-Type', 'text/json');
            body = JSON.stringify(data);
        }
        else if (config.encoding === 'formdata') {
            headers = headers.delete('Content-Type');
            body = new FormData();
            lodash_1.forEach(data, function (item, key) {
                if (item != null && item.name) {
                    body.append(key, item, item.name);
                }
                else {
                    body.append(key, item);
                }
            });
        }
        //begin(request, headers, config);
        // var timeout = config.uploadTimeout;
        //   var slowTimeout = null;
        //     if(!hasFile) {
        //       timeout = config.timeout;
        //       if(config.slowTimeout) {
        //         slowTimeout = setTimeout(function() {
        //           fsAlert.info('Your request is still processing, please wait...',{ hideDelay: 0, toastClass: 'fs-api-slow-timeout' });
        //         },config.slowTimeout * 1000);
        //     }
        //if(url.match(/^http/)) {
        // let url = config.url + url;
        // if(config.forceHttps && !url.match(/^https/)) {
        //   if(url.match(/^http/)) {
        //     url = url.replace(/^https/,'https');
        //   } else {
        //     url = 'https://' + $location.$$host + ($location.$$port==80 ? '' : ':' + $location.$$port) + url;
        //   }
        // }
        var params = new http_1.HttpParams();
        lodash_1.forEach(config.query, function (value, name) {
            params = params.append(name, value);
        });
        var request = new http_1.HttpRequest(method, url, body, {
            headers: headers,
            params: params,
            reportProgress: config.reportProgress
        });
        if (config.reportProgress) {
            config.responseType = classes_1.ResponseType.httpEvent;
        }
        this.trigger('begin', request, config);
        return Observable_1.Observable.create(function (observer) {
            _this.intercept(config, request, new classes_1.FsApiHandler(_this.http))
                .subscribe(function (event) {
                if (config.responseType == classes_1.ResponseType.httpEvent) {
                    observer.next(event);
                }
                else if (event.type === http_1.HttpEventType.Response) {
                    _this.trigger('success', event, config);
                    observer.next(event.body);
                }
            }, function (err) {
                _this.trigger('error', err, config);
                observer.error(err);
            }, function () {
                _this.trigger('complete', {}, config);
                observer.complete();
            });
        });
    };
    FsApi.prototype.on = function (name, func) {
        this.events.push({ name: name, func: func });
        return this;
    };
    FsApi.prototype.trigger = function (name, data, config) {
        lodash_1.forEach(this.events, function (event) {
            if (name === event.name) {
                event.func(data, config);
            }
        });
        return this;
    };
    FsApi.prototype.intercept = function (config, request, next) {
        return next.handle(request);
    };
    FsApi.prototype.sanitize = function (obj) {
        var self = this;
        lodash_1.forEach(obj, function (value, key) {
            if (moment && moment.isMoment(value)) {
                obj[key] = value.format();
            }
            else if (value instanceof Date) {
                obj[key] = moment(value).format();
            }
            else if (value === undefined) {
                delete obj[key];
            }
            else if (lodash_1.isObject(value)) {
                self.sanitize(value);
            }
        });
        return obj;
    };
    FsApi = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [classes_1.FsApiConfig, http_1.HttpClient])
    ], FsApi);
    return FsApi;
}());
exports.FsApi = FsApi;
//# sourceMappingURL=fsapi.service.js.map