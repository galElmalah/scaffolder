import { showSuccessMessage } from '../cliHelpers';
import { getKeysValues } from './questions';
import {
	asyncExecutor,
	TemplatesBuilder,
	templateReader,
	templateTransformer,
	injector,
	Config,
	contextFactory
} from 'scaffolder-core';
import { spinners } from './spinners';
import { join } from 'path';
import { makeLogger } from '../cliHelpers/logger';

export async function createChosenTemplate(availableTemplateCommands: any, chosenTemplate: any, command: any) {
	const { config: configObject, currentCommandTemplate, filesCount } = templateReader(availableTemplateCommands, chosenTemplate);

	const config = new Config(configObject).forTemplate(chosenTemplate);

	try {
		config.validateConfig();
	} catch (e) {
		console.log(e.message);
	}

	const baseCtx = {
		parametersValues: {},
		templateName: chosenTemplate,
		templateRoot: availableTemplateCommands[chosenTemplate],
		targetRoot: join(command.entryPoint || process.cwd(), command.pathPrefix || ''),
		logger: makeLogger()
	};

	const {
		preAskingQuestions,
		preTemplateGeneration,
		postTemplateGeneration
	} = config.get.hooks();

	const makeContext = contextFactory(baseCtx);

	await asyncExecutor(
		preAskingQuestions,
		`\nExecuted "${chosenTemplate}" pre-asking questions hook.`,
		(e) =>
			`\nError while Executing "${chosenTemplate}" pre-asking questions hook::\n${e}`,
		makeContext()
	);

	const parametersValues = await getKeysValues(
		currentCommandTemplate,
		config
	);


	const globalCtx = makeContext({ parametersValues });

	spinners.creatingTemplate.start(`Creating "${chosenTemplate}"...`);

	const templates = templateTransformer(
		currentCommandTemplate,
		injector(parametersValues, config, globalCtx),
		globalCtx
	);

	const templatesBuilder = new TemplatesBuilder(templates, chosenTemplate);

	command.entryPoint &&
		templatesBuilder.withCustomEntryPoint(command.entryPoint);

	command.pathPrefix &&
		templatesBuilder.withPathPrefix(command.pathPrefix);


	await asyncExecutor(
		preTemplateGeneration,
		`\nExecuted "${chosenTemplate}" pre-template generation hook.`,
		(e) => `\nError while Executing "${chosenTemplate}" pre template generation hook::\n${e}`,
		globalCtx,
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
