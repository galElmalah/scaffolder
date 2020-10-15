"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandsBuilder = exports.readTemplatesFromPaths = exports.templatePathsFinder = exports.SEARCH_DEPTH_LIMIT = exports.TEMPLATE_FOLDER_NAME = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var Errors_1 = require("../Errors");
var filesUtils_1 = require("../filesUtils");
exports.TEMPLATE_FOLDER_NAME = 'scaffolder';
exports.SEARCH_DEPTH_LIMIT = 25;
exports.templatePathsFinder = function (currentPath) {
    var pathsQueue = [];
    var pathRoot = path_1.default.parse(currentPath).root;
    var isEndOfPath = function (_path) { return _path === pathRoot || _path === '/' || _path === '' || _path === './'; };
    var shouldStopSearching = function (_path, depth) { return isEndOfPath(_path) || depth === exports.SEARCH_DEPTH_LIMIT; };
    var findTemplate = function (currentPath, depth) {
        if (depth === void 0) { depth = 0; }
        if (isEndOfPath(currentPath) && pathsQueue.length === 0) {
            throw new Errors_1.NoScaffolderFolder();
        }
        if (shouldStopSearching(currentPath, depth)) {
            return pathsQueue;
        }
        var currentDir = fs_1.default.readdirSync(currentPath);
        var isScaffolderFolderInThisLevel = currentDir.find(function (f) { return f === exports.TEMPLATE_FOLDER_NAME; });
        if (isScaffolderFolderInThisLevel &&
            filesUtils_1.isFolder(currentPath, exports.TEMPLATE_FOLDER_NAME)) {
            pathsQueue.push(path_1.default.join(currentPath, exports.TEMPLATE_FOLDER_NAME));
        }
        return findTemplate(path_1.default.join(currentPath, '../'), depth + 1);
    };
    return findTemplate(currentPath);
};
exports.readTemplatesFromPaths = function (paths) {
    var allCommands = {};
    var _loop_1 = function (scaffolderPath) {
        var commands = fs_1.default.readdirSync(scaffolderPath);
        if (!commands) {
            return "continue";
        }
        var commandsToPath = commands
            .filter(function (p) { return p && p[0] !== '.'; })
            .filter(function (p) { return filesUtils_1.isFolder(scaffolderPath, p); })
            .reduce(function (accm, cmd) {
            var _a;
            return (__assign(__assign({}, accm), (_a = {}, _a[cmd] = path_1.default.join(scaffolderPath, cmd), _a)));
        }, {});
        allCommands = __assign(__assign({}, commandsToPath), allCommands);
    };
    for (var _i = 0, paths_1 = paths; _i < paths_1.length; _i++) {
        var scaffolderPath = paths_1[_i];
        _loop_1(scaffolderPath);
    }
    return allCommands;
};
exports.commandsBuilder = function (currentPath) {
    var scaffolderPaths = exports.templatePathsFinder(currentPath);
    return exports.readTemplatesFromPaths(scaffolderPaths);
};
//# sourceMappingURL=index.js.map