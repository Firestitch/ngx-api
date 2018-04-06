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
var core_1 = require("@angular/core");
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
//# sourceMappingURL=fsapiconfig.js.map