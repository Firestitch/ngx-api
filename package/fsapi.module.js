"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("@angular/common/http");
var _1 = require("./");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
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
//# sourceMappingURL=fsapi.module.js.map