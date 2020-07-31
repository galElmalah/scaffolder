const {
	templateReader,
	templateTransformer,
	injector: _injector,
} = require('../createTemplateStructure');
const { commandsBuilder } = require('../commandsBuilder');
const TemplatesBuilder = require('../TemplatesBuilder');
const { handleError, showSuccessMessage } = require('../cliHelpers');
const {
	getKeysValues,
	chooseTemplate,
} = require('./questions');

const interactiveCreateCommandHandler = async (command) => {
	try {
		const availableTemplateCommands = await commandsBuilder(process.cwd());
		const { chosenTemplate } = await chooseTemplate(availableTemplateCommands);

		const { config, currentCommandTemplate } = templateReader(
			availableTemplateCommands
		)(chosenTemplate);

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
			_injector(keyValuePairs, config, globalCtx),
			globalCtx
		);
		const templatesBuilder = new TemplatesBuilder(templates, chosenTemplate);

		if (command.entryPoint) {
			templatesBuilder.withCustomEntryPoint(command.entryPoint);
		}

		return Promise.all(templatesBuilder.build()).then(() => {
			showSuccessMessage(chosenTemplate, templatesBuilder.getFullPath());
		});
	} catch (err) {
		handleError(err);
	}
};

module.exports = {
	interactiveCreateCommandHandler,
};
