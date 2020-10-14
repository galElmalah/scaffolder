var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { templateReader, templateTransformer, injector: _injector, } = require('../createTemplateStructure');
const { commandsBuilder, readTemplatesFromPaths } = require('../commandsBuilder');
const TemplatesBuilder = require('../TemplatesBuilder');
const { handleError, showSuccessMessage } = require('../cliHelpers');
const { getKeysValues, chooseTemplate, getRepositorySource } = require('./questions');
const { getTemplateHooksFromConfig } = require('./getTemplateHooksFromConfig');
const { asyncExecutor } = require('./asyncExecutor');
const { GithubTempCloner } = require('../GithubTempCloner');
const getChosenTemplate = (availableTemplateCommands, preSelectedTemplate) => __awaiter(this, void 0, void 0, function* () {
    if (availableTemplateCommands[preSelectedTemplate]) {
        return {
            chosenTemplate: preSelectedTemplate
        };
    }
    return chooseTemplate(availableTemplateCommands);
});
const getAvailableTemplatesCommands = (path, fromGithub, gitCloner) => {
    if (fromGithub) {
        const directoryPath = gitCloner.clone();
        return readTemplatesFromPaths([`${directoryPath}/scaffolder`]);
    }
    return commandsBuilder(path);
};
const interactiveCreateCommandHandler = (command) => __awaiter(this, void 0, void 0, function* () {
    const gitCloner = new GithubTempCloner();
    try {
        if (command.fromGithub) {
            const { repositorySource } = yield getRepositorySource();
            gitCloner.setSrc(repositorySource);
        }
        const availableTemplateCommands = getAvailableTemplatesCommands(process.cwd(), command.fromGithub, gitCloner);
        const { chosenTemplate } = yield getChosenTemplate(availableTemplateCommands, command.template);
        const { config, currentCommandTemplate } = templateReader(availableTemplateCommands)(chosenTemplate);
        const { preTemplateGeneration, postTemplateGeneration } = getTemplateHooksFromConfig(config, chosenTemplate);
        const keyValuePairs = yield getKeysValues(currentCommandTemplate, config.parametersOptions);
        const globalCtx = {
            parametersValues: keyValuePairs,
            templateName: chosenTemplate,
            templateRoot: availableTemplateCommands[chosenTemplate],
            targetRoot: command.entryPoint || process.cwd(),
        };
        const templates = templateTransformer(currentCommandTemplate, _injector(keyValuePairs, config, globalCtx), globalCtx);
        const templatesBuilder = new TemplatesBuilder(templates, chosenTemplate);
        command.entryPoint &&
            templatesBuilder.withCustomEntryPoint(command.entryPoint);
        command.pathPrefix &&
            templatesBuilder.withPathPrefix(command.pathPrefix);
        yield asyncExecutor(preTemplateGeneration, `Executed "${chosenTemplate}" pre-template generation hook.`, (e) => `Error while Executing "${chosenTemplate}" pre template generation hook::\n${e}`, globalCtx);
        const writePromise = templatesBuilder.build();
        yield Promise.all(writePromise);
        showSuccessMessage(chosenTemplate, templatesBuilder.getFullPath());
        asyncExecutor(postTemplateGeneration, `Executed "${chosenTemplate}" post-template generation hook.`, (e) => `Error while Executing "${chosenTemplate}" post-template generation hook::\n${e}`, globalCtx);
    }
    catch (err) {
        handleError(err);
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