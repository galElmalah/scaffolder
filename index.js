const { extractAllKeysFromTemplate, getQuestionMessage, getValidationFunction, isAValidGithubSource } = require('./src/cliCommandHandlers/questions');
const { commandsBuilder } = require('./src/commandsBuilder');
const { templateReader, extractKey, injector, templateTransformer } = require('./src/createTemplateStructure');
const TemplatesBuilder = require('./src/TemplatesBuilder');
const { asyncExecutor } = require('./src/cliCommandHandlers/asyncExecutor');
const { getTemplateHooksFromConfig } = require('./src/cliCommandHandlers/getTemplateHooksFromConfig');
const { GithubTempCloner } = require('./src/GithubTempCloner');
const { getAvailableTemplatesCommands } = require('./src/cliCommandHandlers/interactiveCreateHandler');



module.exports = {
	getAvailableTemplatesCommands,
	GithubTempCloner,
	isAValidGithubSource,
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