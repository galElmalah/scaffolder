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
exports.FolderAlreadyExists = void 0;
var _a = require('../cliHelpers/colors'), error = _a.error, boldGreen = _a.boldGreen, path = _a.path;
var FolderAlreadyExists = /** @class */ (function (_super) {
    __extends(FolderAlreadyExists, _super);
    function FolderAlreadyExists(_a) {
        var cmd = _a.cmd, folder = _a.folder, path = _a.path;
        var _this = _super.call(this) || this;
        _this.cmd = cmd;
        _this.folder = folder;
        _this.path = path;
        return _this;
    }
    FolderAlreadyExists.prototype.getDisplayErrorMessage = function () {
        var message = error("Error while creating the \"" + boldGreen(this.cmd) + "\" template.") + "\nThere is probably a folder with the same name as \"" + boldGreen(this.folder) + "\"\nAt the location " + path(this.path) + "\n          ";
        return message;
    };
    Object.defineProperty(FolderAlreadyExists.prototype, "name", {
        get: function () {
            return 'FolderAlreadyExists';
        },
        enumerable: false,
        configurable: true
    });
    return FolderAlreadyExists;
}(Error));
exports.FolderAlreadyExists = FolderAlreadyExists;
//# sourceMappingURL=FolderAlreadyExists.js.map