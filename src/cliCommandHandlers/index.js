const inquirer = require('inquirer');
const {
	templateReader,
	templateTransformer,
	injector: _injector,
} = require('../createTemplateStructure');
const { commandsBuilder } = require('../commandsBuilder');
const TemplatesBuilder = require('../TemplatesBuilder');
const {
	generateKeyValues,
	handleError,
	showSuccessMessage,
	displayAvailableCommands,
	displaySpecificCommandTemplate,
} = require('../cliHelpers');
const {
	interactiveCreateCommandHandler,
} = require('./interactiveCreateHandler');

const getTransformedTemplates = (command, cmd) => {
	const commandsLocations = commandsBuilder(cmd.loadFrom || process.cwd());
	const { config, currentCommandTemplate } = templateReader(commandsLocations)(
		command
	);

	const keyValuePairs = generateKeyValues(cmd);

	const globalCtx = {
		templateName: command,
		templateRoot: commandsLocations[command],
		parametersValues: keyValuePairs,
		targetRoot: cmd.entryPoint || process.cwd(),
	};
	

	const injector = _injector(keyValuePairs, config, globalCtx);
	const transformedTemplate = templateTransformer(
		currentCommandTemplate,
		injector,
		globalCtx
	);

	return transformedTemplate;
};

const createCommandHandler = (command, cmd) => {
	try {
		const templates = getTransformedTemplates(command, cmd);

		const templatesBuilder = new TemplatesBuilder(templates, command);
		cmd.folder && templatesBuilder.inAFolder(cmd.folder);
		cmd.entryPoint && templatesBuilder.withCustomEntryPoint(cmd.entryPoint);

		return Promise.all(templatesBuilder.build()).then(() => {
			showSuccessMessage(command, templatesBuilder.getFullPath());
		});
	} catch (err) {
		handleError(err);
	}
};

const listCommandHandler = (command) => {
	const entryPoint = command.entryPoint || process.cwd();
	const commands = commandsBuilder(entryPoint);
	displayAvailableCommands(commands);
};

const showCommandHandler = (command, cmd) => {
	const commandsLocations = commandsBuilder(process.cwd());
	const { currentCommandTemplate } = templateReader(commandsLocations)(
		command
	);
	
	displaySpecificCommandTemplate(currentCommandTemplate, cmd.showContent);
};

module.exports = {
	createCommandHandler,
	listCommandHandler,
	showCommandHandler,
	interactiveCreateCommandHandler,
};
