(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("@firestitch/api", [], factory);
	else if(typeof exports === 'object')
		exports["@firestitch/api"] = factory();
	else
		root["@firestitch/api"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./classes/fsapiconfig.ts":
/***/ (function(module, exports, __webpack_require__) {

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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("@angular/core");
var ResponseType;
(function (ResponseType) {
    ResponseType["body"] = "body";
    ResponseType["httpEvent"] = "httpEvent";
})(ResponseType = exports.ResponseType || (exports.ResponseType = {}));
var FsApiConfig = (function () {
    function FsApiConfig(config) {
        this.config = config;
        /** A key value store for the request headers. */
        this.headers = {};
        this.encoding = 'json';
        this.key = null;
        this.query = {};
        this.responseType = ResponseType.body;
        Object.assign(this, config || {});
    }
    /** Adds or overrides a header value based on the name */
    FsApiConfig.prototype.appendHeader = function (name, value) {
        this.headers[name] = value;
    };
    FsApiConfig = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Optional()), __param(0, core_1.Inject('FsApiConfig')),
        __metadata("design:paramtypes", [Object])
    ], FsApiConfig);
    return FsApiConfig;
}());
exports.FsApiConfig = FsApiConfig;


/***/ }),

/***/ "./classes/fsapihandler.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var FsApiHandler = (function () {
    function FsApiHandler(http) {
        this.http = http;
    }
    FsApiHandler.prototype.handle = function (request) {
        return this.http.request(request);
    };
    return FsApiHandler;
}());
exports.FsApiHandler = FsApiHandler;


/***/ }),

/***/ "./classes/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./classes/fsapiconfig.ts"));
__export(__webpack_require__("./classes/fsapihandler.ts"));


/***/ }),

/***/ "./fsapi.module.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __webpack_require__("@angular/common/http");
var _1 = __webpack_require__("./index.ts");
var core_1 = __webpack_require__("@angular/core");
var common_1 = __webpack_require__("@angular/common");
var FsApiModule = (function () {
    function FsApiModule() {
    }
    FsApiModule_1 = FsApiModule;
    FsApiModule.forRoot = function () {
        return {
            ngModule: FsApiModule_1,
            providers: [_1.FsApiConfig, _1.FsApi]
        };
    };
    FsApiModule = FsApiModule_1 = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                http_1.HttpClientModule
            ],
            declarations: [],
            providers: [
                _1.FsApi,
                _1.FsApiConfig
            ],
            exports: []
        })
    ], FsApiModule);
    return FsApiModule;
    var FsApiModule_1;
}());
exports.FsApiModule = FsApiModule;


/***/ }),

/***/ "./index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./services/index.ts"));
__export(__webpack_require__("./classes/index.ts"));
__export(__webpack_require__("./fsapi.module.ts"));


/***/ }),

/***/ "./services/fsapi.service.ts":
/***/ (function(module, exports, __webpack_require__) {

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
var core_1 = __webpack_require__("@angular/core");
var Observable_1 = __webpack_require__("rxjs/Observable");
var http_1 = __webpack_require__("@angular/common/http");
var moment = __webpack_require__("moment-timezone");
var classes_1 = __webpack_require__("./classes/index.ts");
var lodash_1 = __webpack_require__("lodash");
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
        var httpObservable = null;
        return new Observable_1.Observable(function (observer) {
            httpObservable = _this.intercept(config, request, new classes_1.FsApiHandler(_this.http))
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
            return {
                unsubscribe: function () {
                    httpObservable.unsubscribe();
                }
            };
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


/***/ }),

/***/ "./services/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./services/fsapi.service.ts"));


/***/ }),

/***/ "@angular/common":
/***/ (function(module, exports) {

module.exports = require("@angular/common");

/***/ }),

/***/ "@angular/common/http":
/***/ (function(module, exports) {

module.exports = require("@angular/common/http");

/***/ }),

/***/ "@angular/core":
/***/ (function(module, exports) {

module.exports = require("@angular/core");

/***/ }),

/***/ "lodash":
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),

/***/ "moment-timezone":
/***/ (function(module, exports) {

module.exports = require("moment-timezone");

/***/ }),

/***/ "rxjs/Observable":
/***/ (function(module, exports) {

module.exports = require("rxjs/Observable");

/***/ })

/******/ });
});
//# sourceMappingURL=index.map