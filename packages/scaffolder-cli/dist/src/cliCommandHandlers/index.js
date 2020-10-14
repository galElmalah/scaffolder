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
Object.defineProperty(exports, "__esModule", { value: true });
exports.showCommandHandler = exports.listCommandHandler = exports.createCommandHandler = exports.interactiveCreateCommandHandler = void 0;
const cliHelpers_1 = require("../cliHelpers");
const questions_1 = require("./questions");
const scaffolder_core_1 = require("scaffolder-core");
var interactiveCreateHandler_1 = require("./interactiveCreateHandler");
Object.defineProperty(exports, "interactiveCreateCommandHandler", { enumerable: true, get: function () { return interactiveCreateHandler_1.interactiveCreateCommandHandler; } });
const validateParametersValues = (parametersOptions, keyValuePairs) => {
    for (const [parameter, value] of Object.entries(keyValuePairs)) {
        const validationFn = questions_1.getValidationFunction(parametersOptions, parameter);
        if (validationFn) {
            const res = validationFn(value);
            if (typeof res === 'string') {
                throw new Error(`invalid value for "${parameter}"::${res}`);
            }
        }
    }
};
const getTransformedTemplates = (command, cmd) => {
    const commandsLocations = scaffolder_core_1.commandsBuilder(cmd.loadFrom || process.cwd());
    const { config, currentCommandTemplate } = scaffolder_core_1.templateReader(commandsLocations)(command);
    const keyValuePairs = cliHelpers_1.generateKeyValues(cmd);
    validateParametersValues(config.parametersOptions, keyValuePairs);
    const globalCtx = {
        templateName: command,
        templateRoot: commandsLocations[command],
        parametersValues: keyValuePairs,
        targetRoot: cmd.entryPoint || process.cwd(),
    };
    const _injector = scaffolder_core_1.injector(keyValuePairs, config, globalCtx);
    const transformedTemplate = scaffolder_core_1.templateTransformer(currentCommandTemplate, _injector, globalCtx);
    return {
        transformedTemplate,
        config,
        globalCtx,
    };
};
exports.createCommandHandler = (command, cmd) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { transformedTemplate: templates, config, globalCtx, } = getTransformedTemplates(command, cmd);
        const { preTemplateGeneration, postTemplateGeneration, } = scaffolder_core_1.getTemplateHooksFromConfig(config, command);
        const templatesBuilder = new scaffolder_core_1.TemplatesBuilder(templates, command);
        cmd.folder && templatesBuilder.inAFolder(cmd.folder);
        cmd.entryPoint && templatesBuilder.withCustomEntryPoint(cmd.entryPoint);
        cmd.pathPrefix && templatesBuilder.withPathPrefix(cmd.pathPrefix);
        yield scaffolder_core_1.asyncExecutor(preTemplateGeneration, `Executed "${command}" pre-template generation hook.`, (e) => `Error while Executing "${command}" pre template generation hook::\n${e}`, globalCtx);
        yield Promise.all(templatesBuilder.build());
        cliHelpers_1.showSuccessMessage(command, templatesBuilder.getFullPath());
        scaffolder_core_1.asyncExecutor(postTemplateGeneration, `Executed "${command}" post-template generation hook.`, (e) => `Error while Executing "${command}" post-template generation hook::\n${e}`, globalCtx);
    }
    catch (err) {
        cliHelpers_1.handleError(err);
    }
});
exports.listCommandHandler = (command) => {
    const entryPoint = command.entryPoint || process.cwd();
    const commands = scaffolder_core_1.commandsBuilder(entryPoint);
    cliHelpers_1.displayAvailableCommands(commands);
};
exports.showCommandHandler = (command, cmd) => {
    const commandsLocations = scaffolder_core_1.commandsBuilder(process.cwd());
    const { currentCommandTemplate } = scaffolder_core_1.templateReader(commandsLocations)(command);
    cliHelpers_1.displaySpecificCommandTemplate(currentCommandTemplate, cmd.showContent);
};
//# sourceMappingURL=index.js.map