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
exports.MissingTransformerImplementation = void 0;
var _a = require('../cliHelpers/colors'), error = _a.error, boldGreen = _a.boldGreen, path = _a.path;
var MissingTransformerImplementation = /** @class */ (function (_super) {
    __extends(MissingTransformerImplementation, _super);
    function MissingTransformerImplementation(_a) {
        var transformationKey = _a.transformationKey;
        var _this = _super.call(this) || this;
        _this.transformationKey = transformationKey;
        return _this;
    }
    MissingTransformerImplementation.prototype.getDisplayErrorMessage = function () {
        var message = error("Error while trying to apply the following transformation \"" + boldGreen(this.transformationKey) + "\".") + "\nYou are probably missing a definition for the \"" + boldGreen(this.transformationKey) + "\" transformer in your scaffolder.config.js file\nFor more information about transformers check this out " + path('https://github.com/galElmalah/scaffolder#getting-started');
        return message;
    };
    Object.defineProperty(MissingTransformerImplementation.prototype, "name", {
        get: function () {
            return 'MissingTransformerImplementation';
        },
        enumerable: false,
        configurable: true
    });
    return MissingTransformerImplementation;
}(Error));
exports.MissingTransformerImplementation = MissingTransformerImplementation;
//# sourceMappingURL=MissingTransformerImplementation.js.map