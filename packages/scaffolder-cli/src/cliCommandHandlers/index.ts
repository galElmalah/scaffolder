import {
	generateKeyValues,
	handleError,
	showSuccessMessage,
	displayAvailableCommands,
	displaySpecificCommandTemplate,
} from '../cliHelpers';
import { failAll } from './spinners';
import {
	asyncExecutor,
	TemplatesBuilder,
	commandsBuilder,
	templateReader,
	templateTransformer,
	injector,
	Config,
	IConfig,
	contextFactory,
	boldGreen,
	saveRemote,
	deleteRemote
} from 'scaffolder-core';
import { join } from 'path';
import { makeLogger } from '../cliHelpers/logger';
export { interactiveCreateCommandHandler } from './interactiveCreateHandler';

const validateParametersValues = (config: IConfig, keyValuePairs) => {
	for (const [parameter, value] of Object.entries(keyValuePairs)) {
		const { validation } = config.get.parameterOptions(parameter);
		if (validation) {
			const res = validation(value);
			if (typeof res === 'string') {
				throw new Error(`invalid value for "${parameter}"::${res}`);
			}
		}
	}
};


const getTransformedTemplates = async (command, cmd) => {
	const commandsLocations = commandsBuilder(cmd.loadFrom || process.cwd());
	const { config: configObject, currentCommandTemplate } = templateReader(commandsLocations)(
		command
	);

	const config = new Config(configObject).forTemplate(command);

	try {
		config.validateConfig();
	} catch (e) {
		console.log(e.message);
	}

	
	const { preAskingQuestions } = config.get.hooks();

	const baseCtx = {
		templateName: command,
		templateRoot: commandsLocations[command].location,
		targetRoot: join(cmd.entryPoint || process.cwd(), cmd.pathPrefix || ''),
		logger: makeLogger(),
		parametersValues: {}
	};

	const makeContext = contextFactory(baseCtx);

	await asyncExecutor(
		preAskingQuestions,
		`\nExecuted "${command}" pre-asking questions hook.`,
		(e) =>
			`\nError while Executing "${command}" pre-asking questions hook::\n${e}`,
		makeContext()
	);

	const parametersValues = generateKeyValues(cmd);


	validateParametersValues(config, parametersValues);

	const globalCtx = makeContext({parametersValues});

	const _injector = injector(parametersValues, config, 	globalCtx);
	const transformedTemplate = templateTransformer(
		currentCommandTemplate,
		_injector,
		globalCtx,
	);

	return {
		transformedTemplate,
		config,
		globalCtx,
	};
};

export const createCommandHandler = async (command, cmd) => {
	try {
		const {
			transformedTemplate: templates,
			config,
			globalCtx,
		} = await getTransformedTemplates(command, cmd);


		const {
			preTemplateGeneration,
			postTemplateGeneration,
		} = config.get.hooks();

		const templatesBuilder = new TemplatesBuilder(templates, command);
		cmd.folder && templatesBuilder.inAFolder(cmd.folder);
		cmd.entryPoint && templatesBuilder.withCustomEntryPoint(cmd.entryPoint);
		cmd.pathPrefix && templatesBuilder.withPathPrefix(cmd.pathPrefix);


		await asyncExecutor(
			preTemplateGeneration,
			`Executed "${command}" pre-template generation hook.`,
			(e) =>
				`Error while Executing "${command}" pre template generation hook::\n${e}`,
			globalCtx
		);

		await Promise.all(templatesBuilder.build());

		showSuccessMessage(command, templatesBuilder.getFullPath());
		asyncExecutor(
			postTemplateGeneration,
			`Executed "${command}" post-template generation hook.`,
			(e) =>
				`Error while Executing "${command}" post-template generation hook::\n${e}`,
			globalCtx
		);
	} catch (err) {
		handleError(err);
		failAll();
	}
};

export const listCommandHandler = (command) => {
	const entryPoint = join(command.entryPoint || process.cwd(), command.pathPrefix || '');
	const commands = commandsBuilder(entryPoint);
	displayAvailableCommands(commands);
};

export const showCommandHandler = (command, cmd) => {
	const commandsLocations = commandsBuilder(command.entryPoint || process.cwd());
	const { currentCommandTemplate } = templateReader(commandsLocations)(command);

	displaySpecificCommandTemplate(currentCommandTemplate, cmd.showContent);
};



export const saveRemotesCommandHandler = async (location:string, cmd) => {
	const name = cmd.name;
	
	await saveRemote(name, location);
	console.log(boldGreen(`Successfully saved "${location}" under the alias "${name}"`));
};

export const deleteRemotesCommandHandler = async (name:string) => {
	await deleteRemote(name);
	console.log(boldGreen(`Successfully deleted "${name}"."`));
};