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

/***/ "./classes/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./classes/fsapiconfig.ts"));
__export(__webpack_require__("./classes/request-handler.ts"));


/***/ }),

/***/ "./classes/request-handler.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RequestHandler = (function () {
    function RequestHandler(next, interceptor) {
        this.next = next;
        this.interceptor = interceptor;
    }
    RequestHandler.prototype.handle = function (req) {
        return this.interceptor.intercept(req, this.next);
    };
    return RequestHandler;
}());
exports.RequestHandler = RequestHandler;


/***/ }),

/***/ "./fsapi-providers.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("@angular/core");
exports.FS_API_REQUEST_INTERCEPTOR = new core_1.InjectionToken('fs-app.request_interceptor');
exports.FS_API_RESPONSE_HANDLER = new core_1.InjectionToken('fs-app.response_handler');


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
var core_1 = __webpack_require__("@angular/core");
var common_1 = __webpack_require__("@angular/common");
var _1 = __webpack_require__("./index.ts");
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
                _1.FsApiConfig,
                http_1.HttpXhrBackend,
                { provide: http_1.HttpBackend, useExisting: http_1.HttpXhrBackend },
            ],
            exports: []
        })
    ], FsApiModule);
    return FsApiModule;
    var FsApiModule_1;
}());
exports.FsApiModule = FsApiModule;


/***/ }),

/***/ "./helpers/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./helpers/interceptor.factory.ts"));


/***/ }),

/***/ "./helpers/interceptor.factory.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function makeInterceptorFactory(klass) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return function (config, data) {
            return new (klass.bind.apply(klass, [void 0, config, data].concat(args)))();
        };
    };
}
exports.makeInterceptorFactory = makeInterceptorFactory;


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
__export(__webpack_require__("./helpers/index.ts"));
__export(__webpack_require__("./interceptors/index.ts"));
__export(__webpack_require__("./fsapi.module.ts"));
__export(__webpack_require__("./fsapi-providers.ts"));


/***/ }),

/***/ "./interceptors/base/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./interceptors/base/request.interceptor.ts"));
__export(__webpack_require__("./interceptors/base/response.handler.ts"));


/***/ }),

/***/ "./interceptors/base/request.interceptor.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var RequestInterceptor = (function () {
    function RequestInterceptor(_config, _data) {
        this._config = _config;
        this._data = _data;
    }
    RequestInterceptor.prototype.intercept = function (req, next) {
        return next.handle(req);
    };
    return RequestInterceptor;
}());
exports.RequestInterceptor = RequestInterceptor;


/***/ }),

/***/ "./interceptors/base/response.handler.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var FsApiResponseHandler = (function () {
    function FsApiResponseHandler() {
    }
    FsApiResponseHandler.prototype.success = function (event, config) {
        event.body = event.body.data;
        if (config.key) {
            event.body = event.body[config.key];
        }
    };
    FsApiResponseHandler.prototype.error = function (error, config) { };
    FsApiResponseHandler.prototype.complete = function (config) { };
    return FsApiResponseHandler;
}());
exports.FsApiResponseHandler = FsApiResponseHandler;


/***/ }),

/***/ "./interceptors/body-handler.interceptor.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __webpack_require__("lodash");
var request_interceptor_1 = __webpack_require__("./interceptors/base/request.interceptor.ts");
var BodyHandlerInterceptor = (function (_super) {
    __extends(BodyHandlerInterceptor, _super);
    function BodyHandlerInterceptor(_config, _data) {
        var _this = _super.call(this, _config, _data) || this;
        _this._config = _config;
        _this._data = _data;
        return _this;
    }
    BodyHandlerInterceptor.prototype.intercept = function (req, next) {
        var _this = this;
        var hasFile = false;
        lodash_1.forEach(this._data, function (item) {
            if (item instanceof Blob) {
                hasFile = true;
                _this._config.encoding = 'formdata';
            }
        });
        var body = null;
        switch (this._config.encoding) {
            case 'url':
                {
                    body = this._data;
                }
                break;
            case 'json':
                {
                    body = JSON.stringify(this._data);
                }
                break;
            case 'formdata':
                {
                    body = new FormData();
                    lodash_1.forEach(this._data, function (item, key) {
                        if (item != null && item.name) {
                            body.append(key, item, item.name);
                        }
                        else {
                            body.append(key, item);
                        }
                    });
                }
                break;
        }
        var modified = req.clone({
            body: body
        });
        return next.handle(modified);
    };
    return BodyHandlerInterceptor;
}(request_interceptor_1.RequestInterceptor));
exports.BodyHandlerInterceptor = BodyHandlerInterceptor;


/***/ }),

/***/ "./interceptors/headers-handler.interceptor.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __webpack_require__("@angular/common/http");
var lodash_1 = __webpack_require__("lodash");
var base_1 = __webpack_require__("./interceptors/base/index.ts");
var HeadersHandlerInterceptor = (function (_super) {
    __extends(HeadersHandlerInterceptor, _super);
    function HeadersHandlerInterceptor(_config, _data) {
        var _this = _super.call(this, _config, _data) || this;
        _this._config = _config;
        _this._data = _data;
        return _this;
    }
    HeadersHandlerInterceptor.prototype.intercept = function (req, next) {
        var _this = this;
        var headers = new http_1.HttpHeaders();
        lodash_1.forEach(this._config.headers, function (value, name) {
            headers = headers.set(name, value);
        });
        lodash_1.forEach(this._data, function (item) {
            if (item instanceof File || item instanceof Blob) {
                _this._config.encoding = 'formdata';
            }
        });
        switch (this._config.encoding) {
            case 'url':
                {
                    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
                }
                break;
            case 'json':
                {
                    headers = headers.set('Content-Type', 'text/json');
                }
                break;
            case 'formdata':
                {
                    headers = headers.delete('Content-Type');
                }
                break;
        }
        var modified = req.clone({ headers: headers });
        return next.handle(modified);
    };
    return HeadersHandlerInterceptor;
}(base_1.RequestInterceptor));
exports.HeadersHandlerInterceptor = HeadersHandlerInterceptor;


/***/ }),

/***/ "./interceptors/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./interceptors/headers-handler.interceptor.ts"));
__export(__webpack_require__("./interceptors/body-handler.interceptor.ts"));
__export(__webpack_require__("./interceptors/params-handler.interceptor.ts"));
__export(__webpack_require__("./interceptors/base/index.ts"));


/***/ }),

/***/ "./interceptors/params-handler.interceptor.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __webpack_require__("@angular/common/http");
var lodash_1 = __webpack_require__("lodash");
var request_interceptor_1 = __webpack_require__("./interceptors/base/request.interceptor.ts");
var ParamsHandlerInterceptor = (function (_super) {
    __extends(ParamsHandlerInterceptor, _super);
    function ParamsHandlerInterceptor(_config, _data) {
        var _this = _super.call(this, _config, _data) || this;
        _this._config = _config;
        _this._data = _data;
        return _this;
    }
    ParamsHandlerInterceptor.prototype.intercept = function (req, next) {
        var params = new http_1.HttpParams();
        lodash_1.forEach(this._config.query, function (value, name) {
            params = params.append(name, value);
        });
        var modified = req.clone({
            params: params,
            reportProgress: this._config.reportProgress
        });
        return next.handle(modified);
    };
    return ParamsHandlerInterceptor;
}(request_interceptor_1.RequestInterceptor));
exports.ParamsHandlerInterceptor = ParamsHandlerInterceptor;


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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = __webpack_require__("@angular/core");
var http_1 = __webpack_require__("@angular/common/http");
var operators_1 = __webpack_require__("rxjs/operators");
var moment = __webpack_require__("moment-timezone");
var lodash_1 = __webpack_require__("lodash");
var classes_1 = __webpack_require__("./classes/index.ts");
var interceptors_1 = __webpack_require__("./interceptors/index.ts");
var fsapi_providers_1 = __webpack_require__("./fsapi-providers.ts");
var base_1 = __webpack_require__("./interceptors/base/index.ts");
var FsApi = (function () {
    function FsApi(apiConfig, http, injector, 
        // Custom interceptors
        requestInterceptors, 
        // Other callbacks
        responseHandler) {
        this.apiConfig = apiConfig;
        this.http = http;
        this.injector = injector;
        this.requestInterceptors = requestInterceptors;
        this.responseHandler = responseHandler;
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
        config = Object.assign({}, this.apiConfig, config);
        method = method.toUpperCase();
        data = Object.assign({}, data);
        this.sanitize(data);
        if (method === 'GET') {
            config.query = data;
            data = {};
        }
        // Create clear request
        var request = new http_1.HttpRequest(method, url);
        var INTERCEPTORS = [
            new interceptors_1.HeadersHandlerInterceptor(config, data),
            new interceptors_1.BodyHandlerInterceptor(config, data),
            new interceptors_1.ParamsHandlerInterceptor(config, data),
        ];
        // Add custom interceptors into chain
        if (Array.isArray(this.requestInterceptors)) {
            var interceptors = this.requestInterceptors
                .map(function (interceptor) { return interceptor(config, data); });
            INTERCEPTORS.push.apply(INTERCEPTORS, interceptors);
        }
        else if (this.requestInterceptors) {
            var interceptor = this.requestInterceptors(config, data);
            INTERCEPTORS.push(interceptor);
        }
        // Executing of interceptors
        var handlersChain = INTERCEPTORS.reduceRight(function (next, interceptor) { return new classes_1.RequestHandler(next, interceptor); }, this.http);
        // Do request and process the answer
        return handlersChain.handle(request)
            .pipe(operators_1.filter(function (event) {
            return config.reportProgress || event instanceof http_1.HttpResponse;
        }), operators_1.tap(function (event) {
            if (event.type === http_1.HttpEventType.Response) {
                _this.responseHandler.success(event, config);
            }
        }), operators_1.map(function (event) {
            return (event.type === http_1.HttpEventType.Response) ? event.body : event;
        }), operators_1.tap({
            error: function (err) { return _this.responseHandler.error(err, config); },
            complete: function () { return _this.responseHandler.complete(config); }
        }));
    };
    /**
     * Sanitize the passed object
     *
     * @param obj
     * @returns {any}
     */
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
        __param(3, core_1.Optional()), __param(3, core_1.Inject(fsapi_providers_1.FS_API_REQUEST_INTERCEPTOR)),
        __param(4, core_1.Optional()), __param(4, core_1.Inject(fsapi_providers_1.FS_API_RESPONSE_HANDLER)),
        __metadata("design:paramtypes", [classes_1.FsApiConfig,
            http_1.HttpXhrBackend,
            core_1.Injector, Object, base_1.FsApiResponseHandler])
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

/***/ "rxjs/operators":
/***/ (function(module, exports) {

module.exports = require("rxjs/operators");

/***/ })

/******/ });
});
//# sourceMappingURL=index.map