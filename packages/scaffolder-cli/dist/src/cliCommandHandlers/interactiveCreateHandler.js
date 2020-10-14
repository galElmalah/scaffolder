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
var cliHelpers_1 = require("../cliHelpers");
var questions_1 = require("./questions");
var scaffolder_core_1 = require("scaffolder-core");
var getChosenTemplate = function (availableTemplateCommands, preSelectedTemplate) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (availableTemplateCommands[preSelectedTemplate]) {
            return [2 /*return*/, {
                    chosenTemplate: preSelectedTemplate
                }];
        }
        return [2 /*return*/, questions_1.chooseTemplate(availableTemplateCommands)];
    });
}); };
var getAvailableTemplatesCommands = function (path, fromGithub, gitCloner) {
    if (fromGithub) {
        var directoryPath = gitCloner.clone();
        return scaffolder_core_1.readTemplatesFromPaths([directoryPath + "/scaffolder"]);
    }
    return scaffolder_core_1.commandsBuilder(path);
};
var interactiveCreateCommandHandler = function (command) { return __awaiter(void 0, void 0, void 0, function () {
    var gitCloner, repositorySource, availableTemplateCommands, chosenTemplate_1, _a, config, currentCommandTemplate, _b, preTemplateGeneration, postTemplateGeneration, keyValuePairs, globalCtx, templates, templatesBuilder, writePromise, err_1;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                gitCloner = new scaffolder_core_1.GithubTempCloner();
                _c.label = 1;
            case 1:
                _c.trys.push([1, 8, 9, 10]);
                if (!command.fromGithub) return [3 /*break*/, 3];
                return [4 /*yield*/, questions_1.getRepositorySource()];
            case 2:
                repositorySource = (_c.sent()).repositorySource;
                gitCloner.setSrc(repositorySource);
                _c.label = 3;
            case 3:
                availableTemplateCommands = getAvailableTemplatesCommands(process.cwd(), command.fromGithub, gitCloner);
                return [4 /*yield*/, getChosenTemplate(availableTemplateCommands, command.template)];
            case 4:
                chosenTemplate_1 = (_c.sent()).chosenTemplate;
                _a = scaffolder_core_1.templateReader(availableTemplateCommands)(chosenTemplate_1), config = _a.config, currentCommandTemplate = _a.currentCommandTemplate;
                _b = scaffolder_core_1.getTemplateHooksFromConfig(config, chosenTemplate_1), preTemplateGeneration = _b.preTemplateGeneration, postTemplateGeneration = _b.postTemplateGeneration;
                return [4 /*yield*/, questions_1.getKeysValues(currentCommandTemplate, config.parametersOptions)];
            case 5:
                keyValuePairs = _c.sent();
                globalCtx = {
                    parametersValues: keyValuePairs,
                    templateName: chosenTemplate_1,
                    templateRoot: availableTemplateCommands[chosenTemplate_1],
                    targetRoot: command.entryPoint || process.cwd(),
                };
                templates = scaffolder_core_1.templateTransformer(currentCommandTemplate, scaffolder_core_1.injector(keyValuePairs, config, globalCtx), globalCtx);
                templatesBuilder = new scaffolder_core_1.TemplatesBuilder(templates, chosenTemplate_1);
                command.entryPoint &&
                    templatesBuilder.withCustomEntryPoint(command.entryPoint);
                command.pathPrefix &&
                    templatesBuilder.withPathPrefix(command.pathPrefix);
                return [4 /*yield*/, scaffolder_core_1.asyncExecutor(preTemplateGeneration, "Executed \"" + chosenTemplate_1 + "\" pre-template generation hook.", function (e) { return "Error while Executing \"" + chosenTemplate_1 + "\" pre template generation hook::\n" + e; }, globalCtx)];
            case 6:
                _c.sent();
                writePromise = templatesBuilder.build();
                return [4 /*yield*/, Promise.all(writePromise)];
            case 7:
                _c.sent();
                cliHelpers_1.showSuccessMessage(chosenTemplate_1, templatesBuilder.getFullPath());
                scaffolder_core_1.asyncExecutor(postTemplateGeneration, "Executed \"" + chosenTemplate_1 + "\" post-template generation hook.", function (e) { return "Error while Executing \"" + chosenTemplate_1 + "\" post-template generation hook::\n" + e; }, globalCtx);
                return [3 /*break*/, 10];
            case 8:
                err_1 = _c.sent();
                cliHelpers_1.handleError(err_1);
                return [3 /*break*/, 10];
            case 9:
                gitCloner.cleanUp();
                return [7 /*endfinally*/];
            case 10: return [2 /*return*/];
        }
    });
}); };
module.exports = {
    interactiveCreateCommandHandler: interactiveCreateCommandHandler,
    getAvailableTemplatesCommands: getAvailableTemplatesCommands
};
//# sourceMappingURL=interactiveCreateHandler.js.map