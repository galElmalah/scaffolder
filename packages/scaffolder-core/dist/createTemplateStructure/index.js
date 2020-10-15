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
Object.defineProperty(exports, "__esModule", { value: true });
exports.injector = exports.keyPatternString = exports.templateTransformer = exports.templateReader = exports.getConfigPath = exports.createTemplateStructure = exports.replaceKeyWithValue = exports.getKeyAndTransformers = exports.isAFunctionKey = exports.extractKey = exports.defaultConfig = void 0;
var fs = require('fs');
var _a = require('../Errors'), NoMatchingTemplate = _a.NoMatchingTemplate, MissingKeyValuePairs = _a.MissingKeyValuePairs, MissingFunctionImplementation = _a.MissingFunctionImplementation;
var _b = require('../filesUtils'), isFolder = _b.isFolder, join = _b.join, TYPES = _b.TYPES;
var applyTransformers = require('./applyTransformers').default.applyTransformers;
exports.defaultConfig = function () { return ({
    transformers: {},
    functions: {},
    parametersOptions: {},
    templatesOptions: {}
}); };
exports.extractKey = function (k) { return k.replace(/({|})/g, '').trim(); };
exports.isAFunctionKey = function (key) { return /.+\(\)/.test(key); };
exports.getKeyAndTransformers = function (initialKey) {
    return exports.extractKey(initialKey)
        .split('|')
        .map(function (_) { return _.trim(); });
};
exports.replaceKeyWithValue = function (keyValuePairs, transformersMap, functionsMap, ctx) { return function (match) {
    if (exports.isAFunctionKey(match)) {
        var functionKey = exports.extractKey(match).replace(/\(|\)/g, '');
        if (!functionsMap.hasOwnProperty(functionKey)) {
            throw new MissingFunctionImplementation({
                functionKey: functionKey
            });
        }
        return functionsMap[functionKey](ctx);
    }
    var _a = exports.getKeyAndTransformers(match), key = _a[0], transformersKeys = _a.slice(1);
    if (!keyValuePairs.hasOwnProperty(key)) {
        throw new MissingKeyValuePairs(match);
    }
    var keyInitialValue = keyValuePairs[key];
    return transformersKeys
        ? applyTransformers(keyInitialValue, transformersMap, transformersKeys, ctx)
        : keyInitialValue;
}; };
exports.createTemplateStructure = function (folderPath) {
    var folderContent = fs.readdirSync(folderPath);
    return folderContent.map(function (file) {
        if (isFolder(folderPath, file)) {
            return {
                type: TYPES.FOLDER,
                name: file,
                content: exports.createTemplateStructure(join(folderPath, file)),
                scaffolderTargetRoot: folderPath,
            };
        }
        return {
            name: file,
            content: fs.readFileSync(join(folderPath, file)).toString(),
            scaffolderTargetRoot: folderPath,
        };
    });
};
exports.getConfigPath = function (path) {
    return path.split('/').slice(0, -1).join('/') + '/scaffolder.config.js';
};
exports.templateReader = function (commands) { return function (cmd) {
    var config = exports.defaultConfig();
    if (!commands[cmd]) {
        throw new NoMatchingTemplate(cmd);
    }
    if (fs.existsSync(exports.getConfigPath(commands[cmd]))) {
        // reset scaffolder config so I wont get old values.
        delete require.cache[exports.getConfigPath(commands[cmd])];
        config = __assign(__assign({}, exports.defaultConfig()), require(exports.getConfigPath(commands[cmd])));
    }
    return {
        config: config,
        currentCommandTemplate: exports.createTemplateStructure(commands[cmd]),
    };
}; };
exports.templateTransformer = function (templateDescriptor, injector, globalCtx) {
    var createLocalCtx = function (_a) {
        var _b = _a.type, type = _b === void 0 ? 'FILE' : _b, scaffolderTargetRoot = _a.scaffolderTargetRoot, name = _a.name;
        var currentFileLocationPath = scaffolderTargetRoot
            .split('scaffolder')
            .pop();
        var currentFilePath = "" + globalCtx.targetRoot + currentFileLocationPath;
        return {
            fileName: name,
            type: type, currentFilePath: currentFilePath
        };
    };
    var transformFile = function (descriptor) { return ({
        name: injector(descriptor.name, createLocalCtx(__assign(__assign({}, descriptor), { type: TYPES.FILE_NAME }))),
        content: injector(descriptor.content, createLocalCtx(__assign(__assign({}, descriptor), { type: TYPES.FILE_CONTENT }))),
    }); };
    var transformerFolder = function (descriptor) { return ({
        type: descriptor.type,
        name: injector(descriptor.name, createLocalCtx(descriptor)),
        content: exports.templateTransformer(descriptor.content, injector, globalCtx),
    }); };
    return templateDescriptor.map(function (descriptor) {
        if (descriptor.type === TYPES.FOLDER) {
            return transformerFolder(descriptor);
        }
        return transformFile(descriptor);
    });
};
exports.keyPatternString = '{{s*[a-zA-Z_|0-9- ()]+s*}}';
exports.injector = function (keyValuePairs, _a, globalCtx) {
    var _b = _a === void 0 ? {} : _a, _c = _b.transformers, transformers = _c === void 0 ? {} : _c, _d = _b.functions, functions = _d === void 0 ? {} : _d;
    return function (text, localCtx) {
        var ctx = __assign(__assign({}, globalCtx), localCtx);
        var keyPattern = new RegExp(exports.keyPatternString, 'g');
        var replacer = exports.replaceKeyWithValue(keyValuePairs, transformers, functions, ctx);
        var transformedText = text.replace(keyPattern, replacer);
        return transformedText;
    };
};
//# sourceMappingURL=index.js.map