import { showSuccessMessage } from '../cliHelpers';
import { getKeysValues } from './questions';
import {
	asyncExecutor,
	getTemplateHooksFromConfig,
	TemplatesBuilder,

	templateReader,
	templateTransformer,
	injector
} from 'scaffolder-core';
import console from 'console';
import {spinners} from './spinners';
export async function createChosenTemplate(availableTemplateCommands: any, chosenTemplate: any, command: any) {
	const { config, currentCommandTemplate, filesCount } = templateReader(availableTemplateCommands, chosenTemplate);

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

	spinners.creatingTemplate.start(`Creating "${chosenTemplate}"...`);
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
	spinners.creatingTemplate.succeed(`Creating "${chosenTemplate}"...\n${filesCount} files have been created.`);
	showSuccessMessage(chosenTemplate, templatesBuilder.getFullPath());
	await asyncExecutor(
		postTemplateGeneration,
		`Executed "${chosenTemplate}" post-template generation hook.`,
		(e) => `Error while Executing "${chosenTemplate}" post-template generation hook::\n${e}`,
		globalCtx
	);
}
