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
const cliHelpers_1 = require("../cliHelpers");
const questions_1 = require("./questions");
const scaffolder_core_1 = require("scaffolder-core");
const getChosenTemplate = (availableTemplateCommands, preSelectedTemplate) => __awaiter(void 0, void 0, void 0, function* () {
    if (availableTemplateCommands[preSelectedTemplate]) {
        return {
            chosenTemplate: preSelectedTemplate
        };
    }
    return questions_1.chooseTemplate(availableTemplateCommands);
});
const getAvailableTemplatesCommands = (path, fromGithub, gitCloner) => {
    if (fromGithub) {
        const directoryPath = gitCloner.clone();
        return scaffolder_core_1.readTemplatesFromPaths([`${directoryPath}/scaffolder`]);
    }
    return scaffolder_core_1.commandsBuilder(path);
};
const interactiveCreateCommandHandler = (command) => __awaiter(void 0, void 0, void 0, function* () {
    const gitCloner = new scaffolder_core_1.GithubTempCloner();
    try {
        if (command.fromGithub) {
            const { repositorySource } = yield questions_1.getRepositorySource();
            gitCloner.setSrc(repositorySource);
        }
        const availableTemplateCommands = getAvailableTemplatesCommands(process.cwd(), command.fromGithub, gitCloner);
        const { chosenTemplate } = yield getChosenTemplate(availableTemplateCommands, command.template);
        const { config, currentCommandTemplate } = scaffolder_core_1.templateReader(availableTemplateCommands)(chosenTemplate);
        const { preTemplateGeneration, postTemplateGeneration } = scaffolder_core_1.getTemplateHooksFromConfig(config, chosenTemplate);
        const keyValuePairs = yield questions_1.getKeysValues(currentCommandTemplate, config.parametersOptions);
        const globalCtx = {
            parametersValues: keyValuePairs,
            templateName: chosenTemplate,
            templateRoot: availableTemplateCommands[chosenTemplate],
            targetRoot: command.entryPoint || process.cwd(),
        };
        const templates = scaffolder_core_1.templateTransformer(currentCommandTemplate, scaffolder_core_1.injector(keyValuePairs, config, globalCtx), globalCtx);
        const templatesBuilder = new scaffolder_core_1.TemplatesBuilder(templates, chosenTemplate);
        command.entryPoint &&
            templatesBuilder.withCustomEntryPoint(command.entryPoint);
        command.pathPrefix &&
            templatesBuilder.withPathPrefix(command.pathPrefix);
        yield scaffolder_core_1.asyncExecutor(preTemplateGeneration, `Executed "${chosenTemplate}" pre-template generation hook.`, (e) => `Error while Executing "${chosenTemplate}" pre template generation hook::\n${e}`, globalCtx);
        const writePromise = templatesBuilder.build();
        yield Promise.all(writePromise);
        cliHelpers_1.showSuccessMessage(chosenTemplate, templatesBuilder.getFullPath());
        scaffolder_core_1.asyncExecutor(postTemplateGeneration, `Executed "${chosenTemplate}" post-template generation hook.`, (e) => `Error while Executing "${chosenTemplate}" post-template generation hook::\n${e}`, globalCtx);
    }
    catch (err) {
        cliHelpers_1.handleError(err);
    }
    finally {
        gitCloner.cleanUp();
    }
});
module.exports = {
    interactiveCreateCommandHandler,
    getAvailableTemplatesCommands
};
//# sourceMappingURL=interactiveCreateHandler.js.map