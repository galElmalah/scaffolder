"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPES = exports.join = exports.isFolder = void 0;
var fs = require('fs');
var path = require('path');
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