"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissingKeyValuePairs = void 0;
var _a = require('../cliHelpers/colors'), error = _a.error, boldGreen = _a.boldGreen;
var extractKey = function (k) { return k.replace(/({|})/g, ''); };
var MissingKeyValuePairs = /** @class */ (function (_super) {
    __extends(MissingKeyValuePairs, _super);
    function MissingKeyValuePairs(key) {
        var _this = _super.call(this) || this;
        _this.key = key;
        return _this;
    }
    MissingKeyValuePairs.prototype.getDisplayErrorMessage = function () {
        var message = error("Error There is no value matching the key " + boldGreen(this.key)) + ".\nYou can pass key value pairs like so key1=value1 key2=value2 etc...\nFor this specific case you should pass the following in the console " + boldGreen(extractKey(this.key + "=<someValue>")) + ".";
        return message;
    };
    Object.defineProperty(MissingKeyValuePairs.prototype, "name", {
        get: function () {
            return 'MissingKeyValuePairs';
        },
        enumerable: false,
        configurable: true
    });
    return MissingKeyValuePairs;
}(Error));
exports.MissingKeyValuePairs = MissingKeyValuePairs;
//# sourceMappingURL=MissingKeyValuePairs.js.map