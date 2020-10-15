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
exports.MissingFunctionImplementation = void 0;
var _a = require('../cliHelpers/colors'), error = _a.error, boldGreen = _a.boldGreen, path = _a.path;
var MissingFunctionImplementation = /** @class */ (function (_super) {
    __extends(MissingFunctionImplementation, _super);
    function MissingFunctionImplementation(_a) {
        var functionKey = _a.functionKey;
        var _this = _super.call(this) || this;
        _this.functionKey = functionKey;
        return _this;
    }
    MissingFunctionImplementation.prototype.getDisplayErrorMessage = function () {
        var message = error("Error while trying to apply the following function \"" + boldGreen(this.functionKey) + "\".") + "\nYou are probably missing a definition for the \"" + boldGreen(this.functionKey) + "\" function in your scaffolder.config.js file\n\t\t\nFor more information about transformers check this out " + path('https://github.com/galElmalah/scaffolder#getting-started');
        return message;
    };
    Object.defineProperty(MissingFunctionImplementation.prototype, "name", {
        get: function () {
            return 'MissingFunctionImplementation';
        },
        enumerable: false,
        configurable: true
    });
    return MissingFunctionImplementation;
}(Error));
exports.MissingFunctionImplementation = MissingFunctionImplementation;
//# sourceMappingURL=MissingFunctionImplementation.js.map