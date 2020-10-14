"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showCommandHandler = exports.listCommandHandler = exports.createCommandHandler = exports.interactiveCreateCommandHandler = void 0;
var cliHelpers_1 = require("../cliHelpers");
var questions_1 = require("./questions");
var scaffolder_core_1 = require("scaffolder-core");
var interactiveCreateHandler_1 = require("./interactiveCreateHandler");
Object.defineProperty(exports, "interactiveCreateCommandHandler", { enumerable: true, get: function () { return interactiveCreateHandler_1.interactiveCreateCommandHandler; } });
var validateParametersValues = function (parametersOptions, keyValuePairs) {
    for (var _i = 0, _a = Object.entries(keyValuePairs); _i < _a.length; _i++) {
        var _b = _a[_i], parameter = _b[0], value = _b[1];
        var validationFn = questions_1.getValidationFunction(parametersOptions, parameter);
        if (validationFn) {
            var res = validationFn(value);
            if (typeof res === 'string') {
                throw new Error("invalid value for \"" + parameter + "\"::" + res);
            }
        }
    }
};
var getTransformedTemplates = function (command, cmd) {
    var commandsLocations = scaffolder_core_1.commandsBuilder(cmd.loadFrom || process.cwd());
    var _a = scaffolder_core_1.templateReader(commandsLocations)(command), config = _a.config, currentCommandTemplate = _a.currentCommandTemplate;
    var keyValuePairs = cliHelpers_1.generateKeyValues(cmd);
    validateParametersValues(config.parametersOptions, keyValuePairs);
    var globalCtx = {
        templateName: command,
        templateRoot: commandsLocations[command],
        parametersValues: keyValuePairs,
        targetRoot: cmd.entryPoint || process.cwd(),
    };
    var _injector = scaffolder_core_1.injector(keyValuePairs, config, globalCtx);
    var transformedTemplate = scaffolder_core_1.templateTransformer(currentCommandTemplate, _injector, globalCtx);
    return {
        transformedTemplate: transformedTemplate,
        config: config,
        globalCtx: globalCtx,
    };
};
exports.createCommandHandler = function (command, cmd) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, templates, config, globalCtx, _b, preTemplateGeneration, postTemplateGeneration, templatesBuilder, err_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                _a = getTransformedTemplates(command, cmd), templates = _a.transformedTemplate, config = _a.config, globalCtx = _a.globalCtx;
                _b = scaffolder_core_1.getTemplateHooksFromConfig(config, command), preTemplateGeneration = _b.preTemplateGeneration, postTemplateGeneration = _b.postTemplateGeneration;
                templatesBuilder = new scaffolder_core_1.TemplatesBuilder(templates, command);
                cmd.folder && templatesBuilder.inAFolder(cmd.folder);
                cmd.entryPoint && templatesBuilder.withCustomEntryPoint(cmd.entryPoint);
                cmd.pathPrefix && templatesBuilder.withPathPrefix(cmd.pathPrefix);
                return [4 /*yield*/, scaffolder_core_1.asyncExecutor(preTemplateGeneration, "Executed \"" + command + "\" pre-template generation hook.", function (e) {
                        return "Error while Executing \"" + command + "\" pre template generation hook::\n" + e;
                    }, globalCtx)];
            case 1:
                _c.sent();
                return [4 /*yield*/, Promise.all(templatesBuilder.build())];
            case 2:
                _c.sent();
                cliHelpers_1.showSuccessMessage(command, templatesBuilder.getFullPath());
                scaffolder_core_1.asyncExecutor(postTemplateGeneration, "Executed \"" + command + "\" post-template generation hook.", function (e) {
                    return "Error while Executing \"" + command + "\" post-template generation hook::\n" + e;
                }, globalCtx);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _c.sent();
                cliHelpers_1.handleError(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.listCommandHandler = function (command) {
    var entryPoint = command.entryPoint || process.cwd();
    var commands = scaffolder_core_1.commandsBuilder(entryPoint);
    cliHelpers_1.displayAvailableCommands(commands);
};
exports.showCommandHandler = function (command, cmd) {
    var commandsLocations = scaffolder_core_1.commandsBuilder(process.cwd());
    var currentCommandTemplate = scaffolder_core_1.templateReader(commandsLocations)(command).currentCommandTemplate;
    cliHelpers_1.displaySpecificCommandTemplate(currentCommandTemplate, cmd.showContent);
};
//# sourceMappingURL=index.js.map