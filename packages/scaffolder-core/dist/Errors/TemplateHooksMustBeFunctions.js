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
exports.TemplateHooksMustBeFunctions = void 0;
var _a = require('../cliHelpers/colors'), error = _a.error, boldGreen = _a.boldGreen, bold = _a.bold;
var TemplateHooksMustBeFunctions = /** @class */ (function (_super) {
    __extends(TemplateHooksMustBeFunctions, _super);
    function TemplateHooksMustBeFunctions(_a) {
        var hookName = _a.hookName, templateName = _a.templateName, hookType = _a.hookType;
        var _this = _super.call(this) || this;
        _this.hookName = hookName;
        _this.templateName = templateName;
        _this.hookType = hookType;
        return _this;
    }
    TemplateHooksMustBeFunctions.prototype.getDisplayErrorMessage = function () {
        var message = error("Error while calling the " + boldGreen("\"" + this.hookName + "\"") + " from " + boldGreen("\"" + this.templateName + "\"") + " template.") + "\nHooks must be of type " + bold('"Function"') + " while your hook is of type " + bold("\"" + this.hookType + "\"") + ".\n          ";
        return message;
    };
    Object.defineProperty(TemplateHooksMustBeFunctions.prototype, "name", {
        get: function () {
            return 'TemplateHooksMustBeFunctions';
        },
        enumerable: false,
        configurable: true
    });
    return TemplateHooksMustBeFunctions;
}(TypeError));
exports.TemplateHooksMustBeFunctions = TemplateHooksMustBeFunctions;
//# sourceMappingURL=TemplateHooksMustBeFunctions.js.map