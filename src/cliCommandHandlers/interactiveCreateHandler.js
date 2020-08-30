const {
	templateReader,
	templateTransformer,
	injector: _injector,
} = require('../createTemplateStructure');
const { commandsBuilder, readTemplatesFromPaths } = require('../commandsBuilder');
const TemplatesBuilder = require('../TemplatesBuilder');
const { handleError, showSuccessMessage } = require('../cliHelpers');
const {
	getKeysValues,
	chooseTemplate,
	getRepositorySource
} = require('./questions');
const { getTemplateHooksFromConfig } = require('./getTemplateHooksFromConfig');
const { asyncExecutor } = require('./asyncExecutor');
const { GithubTempCloner } = require('../GithubTempCloner');
 

const getAvailableTemplatesCommands = (path,fromGithub, gitCloner) => {
	if(fromGithub) {
		const directoryPath = gitCloner.clone();
		return readTemplatesFromPaths([`${directoryPath}/scaffolder`]);
	}

	return commandsBuilder(path);
};
const interactiveCreateCommandHandler = async (command) => {
	const gitCloner =  new GithubTempCloner();
	try {

		if(command.fromGithub) {
			const { repositorySource } = await getRepositorySource();
			gitCloner.setSrc(repositorySource);
		}

		const availableTemplateCommands = getAvailableTemplatesCommands(
			process.cwd(),
			command.fromGithub,
			gitCloner,
		);

		const { chosenTemplate } = await chooseTemplate(availableTemplateCommands);

		const { config, currentCommandTemplate } = templateReader(
			availableTemplateCommands
		)(chosenTemplate);

		const  { 
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
			_injector(keyValuePairs, config, globalCtx),
			globalCtx
		);

		const templatesBuilder = new TemplatesBuilder(templates, chosenTemplate);

		if (command.entryPoint) {
			templatesBuilder.withCustomEntryPoint(command.entryPoint);
		}

		await asyncExecutor(
			preTemplateGeneration,
			`Executed "${chosenTemplate}" pre-template generation hook.`,
			(e) => `Error while Executing "${chosenTemplate}" pre template generation hook::\n${e}`,
			globalCtx
		);


		await Promise.all(templatesBuilder.build());
		showSuccessMessage(chosenTemplate, templatesBuilder.getFullPath());
		asyncExecutor(
			setTimeout( () => postTemplateGeneration(globalCtx), 300),
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
