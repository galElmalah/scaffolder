const { extractAllKeysFromTemplate, getQuestionMessage, getValidationFunction } = require('./src/cliCommandHandlers/questions');
const { commandsBuilder } = require('./src/commandsBuilder');
const { templateReader, extractKey, injector, templateTransformer } = require('./src/createTemplateStructure');
const TemplatesBuilder = require('./src/TemplatesBuilder');
const { asyncExecutor } = require('./src/cliCommandHandlers/asyncExecutor');
const { getTemplateHooksFromConfig } = require('./src/cliCommandHandlers/getTemplateHooksFromConfig');

module.exports = {
	commandsBuilder, 
	templateReader,
	extractKey, 
	extractAllKeysFromTemplate,
	TemplatesBuilder,
	injector,
	getQuestionMessage,
	getValidationFunction,
	templateTransformer,
	asyncExecutor,
	getTemplateHooksFromConfig
};