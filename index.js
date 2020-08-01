const { extractAllKeysFromTemplate, getQuestionMessage } = require('./src/cliCommandHandlers/questions');
const {commandsBuilder} = require('./src/commandsBuilder');
const { templateReader, extractKey, injector, templateTransformer } = require('./src/createTemplateStructure');
const TemplatesBuilder = require('./src/TemplatesBuilder');


module.exports = {
	commandsBuilder, 
	templateReader,
	extractKey, 
	extractAllKeysFromTemplate,
	TemplatesBuilder,
	injector,
	getQuestionMessage,
	templateTransformer
};