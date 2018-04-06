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
//# sourceMappingURL=fsapihandler.js.map