

import { handleError, showSuccessMessage } from '../cliHelpers';
import {
	getKeysValues,
	chooseTemplate,
	getRepositorySource
} from './questions';

import {
	GithubTempCloner,
	readTemplatesFromPaths,
	asyncExecutor,
	getTemplateHooksFromConfig,
	TemplatesBuilder,
	commandsBuilder,
	templateReader,
	templateTransformer,
	injector,
} from 'scaffolder-core';

const getChosenTemplate = async (availableTemplateCommands, preSelectedTemplate) => {

	if (availableTemplateCommands[preSelectedTemplate]) {
		return {
			chosenTemplate: preSelectedTemplate
		};
	}

	return chooseTemplate(availableTemplateCommands);


};

const getAvailableTemplatesCommands = async (path, fromGithub, gitCloner) => {
	if (fromGithub) {
		try {
			return await gitCloner.listTemplates();
		} catch (e) {
			console.log(`Failed to fetch ${gitCloner.gitSrc} via github API.\nFalling back to cloning the repository.`);
			const directoryPath = gitCloner.clone();
			return readTemplatesFromPaths([`${directoryPath}/scaffolder`]);
		}
	}
	return commandsBuilder(path);
};
const interactiveCreateCommandHandler = async (command) => {
	const gitCloner = new GithubTempCloner();
	try {

		if (command.fromGithub) {
			const { repositorySource } = await getRepositorySource();
			gitCloner.setSrc(repositorySource);
		}




		const availableTemplateCommands = await getAvailableTemplatesCommands(
			process.cwd(),
			command.fromGithub,
			gitCloner,
		);

		console.log({ availableTemplateCommands });
		const { chosenTemplate } = await getChosenTemplate(availableTemplateCommands, command.template);

		if (command.fromGithub && !gitCloner.hasCloned()) {
			await gitCloner.clone();
		}

		const { config, currentCommandTemplate } = templateReader(availableTemplateCommands, chosenTemplate);

		const {
			preTemplateGeneration,
			postTemplateGeneration
		} = getTemplateHooksFromConfig(config, chosenTemplate);

		const keyValuePairs = await getKeysValues(
			currentCommandTemplate,
			config.parametersOptions
		);

		const globalCtx = {
			parametersValues: keyValuePairs,
			templateName: chosenTemplate,
			templateRoot: availableTemplateCommands[chosenTemplate],
			targetRoot: command.entryPoint || process.cwd(),
		};

		const templates = templateTransformer(
			currentCommandTemplate,
			injector(keyValuePairs, config, globalCtx),
			globalCtx
		);

		const templatesBuilder = new TemplatesBuilder(templates, chosenTemplate);

		command.entryPoint &&
			templatesBuilder.withCustomEntryPoint(command.entryPoint);

		command.pathPrefix &&
			templatesBuilder.withPathPrefix(command.pathPrefix);


		await asyncExecutor(
			preTemplateGeneration,
			`Executed "${chosenTemplate}" pre-template generation hook.`,
			(e) => `Error while Executing "${chosenTemplate}" pre template generation hook::\n${e}`,
			globalCtx
		);

		const writePromise = templatesBuilder.build();

		await Promise.all(writePromise);

		showSuccessMessage(chosenTemplate, templatesBuilder.getFullPath());
		asyncExecutor(
			postTemplateGeneration,
			`Executed "${chosenTemplate}" post-template generation hook.`,
			(e) => `Error while Executing "${chosenTemplate}" post-template generation hook::\n${e}`,
			globalCtx
		);

	} catch (err) {
		handleError(err);
	} finally {
		gitCloner.cleanUp();
	}
};

module.exports = {
	interactiveCreateCommandHandler,
	getAvailableTemplatesCommands
};
