"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllKeys = void 0;
var _a = require('../createTemplateStructure'), keyPatternString = _a.keyPatternString, isAFunctionKey = _a.isAFunctionKey;
var removeTransformationsFromKey = require('../createTemplateStructure/applyTransformers').removeTransformationsFromKey;
var TYPES = require('../filesUtils').TYPES;
var fillSetWithKeys = function (keys, set) {
    keys
        .filter(function (k) { return !isAFunctionKey(k); })
        .map(removeTransformationsFromKey)
        .forEach(function (k) { return set.add(k); });
};
exports.getAllKeys = function (templates, set) {
    templates.forEach(function (_a) {
        var name = _a.name, content = _a.content, type = _a.type;
        var keyRegex = new RegExp(keyPatternString, 'gi');
        if (type === "FOLDER" /* FOLDER */) {
            var nameKeys_1 = name.match(keyRegex) || [];
            fillSetWithKeys(nameKeys_1, set);
            exports.getAllKeys(content, set).forEach(function (k) { return set.add(k); });
            return;
        }
        var nameKeys = name.match(keyRegex) || [];
        var contentKeys = content.match(keyRegex) || [];
        fillSetWithKeys(__spreadArrays(nameKeys, contentKeys), set);
    });
    return Array.from(set.keys());
};
//# sourceMappingURL=index.js.map