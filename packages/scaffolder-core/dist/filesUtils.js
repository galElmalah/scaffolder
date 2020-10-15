"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPES = exports.join = exports.isFolder = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
exports.isFolder = function (basePath, filePath) {
    return fs.lstatSync(path.resolve(basePath, filePath)).isDirectory();
};
exports.join = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return path.join.apply(path, args);
};
var TYPES;
(function (TYPES) {
    TYPES["FOLDER"] = "FOLDER";
    TYPES["FILE"] = "FILE";
    TYPES["FILE_NAME"] = "FILE_NAME";
    TYPES["FILE_CONTENT"] = "FILE_CONTENT";
})(TYPES = exports.TYPES || (exports.TYPES = {}));
//# sourceMappingURL=filesUtils.js.map