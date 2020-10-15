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
exports.NoMatchingTemplate = void 0;
var _a = require('../cliHelpers/colors'), error = _a.error, boldGreen = _a.boldGreen;
var NoMatchingTemplate = /** @class */ (function (_super) {
    __extends(NoMatchingTemplate, _super);
    function NoMatchingTemplate(cmd) {
        var _this = _super.call(this) || this;
        _this.cmd = cmd;
        return _this;
    }
    NoMatchingTemplate.prototype.getDisplayErrorMessage = function () {
        var message = error("Error while creating the " + boldGreen(this.cmd) + " template.") + "\nThere is no template matching the " + boldGreen(this.cmd) + " command.\nYou can see the available commands by typing " + boldGreen('scaffolder list') + " in the terminal.";
        return message;
    };
    Object.defineProperty(NoMatchingTemplate.prototype, "name", {
        get: function () {
            return 'NoMatchingTemplate';
        },
        enumerable: false,
        configurable: true
    });
    return NoMatchingTemplate;
}(Error));
exports.NoMatchingTemplate = NoMatchingTemplate;
//# sourceMappingURL=NoMatchingTemplate.js.map