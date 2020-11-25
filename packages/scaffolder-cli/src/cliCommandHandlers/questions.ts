import inquirer from 'inquirer';
import { getAllKeys, extractKey } from 'scaffolder-core';
import { IConfig, TemplateStructure } from 'scaffolder-core';

const QUESTIONS = {
	TEMPLATES: {
		type: 'list',
		name: 'chosenTemplate',
		message: 'Choose the template you want to create.',
	},
};

export const chooseTemplate = (commands) => {
	const choices = Object.keys(commands);
	return inquirer.prompt([
		{
			...QUESTIONS.TEMPLATES,
			choices,
		},
	]);
};

export const getQuestionMessage = (parametersOptions = {}, key) => {
	return (
		(parametersOptions[key] && parametersOptions[key].question) ||
    `Enter a value for the following parameter "${key}"`
	);
};

export const getValidationFunction = (parametersOptions = {}, key) => {
	const validationFn =
    parametersOptions[key] && parametersOptions[key].validation;
	if (!validationFn) {
		return;
	}
	return validationFn;
};

export const extractAllKeysFromTemplate = (
	currentCommandTemplate: TemplateStructure
) => {
	const keySet = new Set();
	const keys = getAllKeys(currentCommandTemplate, keySet);
	return keys.filter(Boolean);
};

export const getKeysValues = (
	currentCommandTemplate: TemplateStructure,
	config: IConfig,
	preDefinedParameters: { [key: string]: any }
) => {
	const questions = extractAllKeysFromTemplate(currentCommandTemplate)
		.map(extractKey)
		.filter((key) => !preDefinedParameters[key])
		.map((key) => {
			const { validation, question } = config.get.parameterOptions(key);
			return {
				type: 'input',
				name: key,
				message: question,
				validate: validation,
			};
		});
	return inquirer.prompt(questions);
};

export const isAValidGithubSource = (src) => /(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/.test(src);

export const getRepositorySource = () => {
	return inquirer.prompt({
		type: 'input',
		name: 'repositorySource',
		message:
      'Enter the src of the repository you want to consume templates from:',
		validate: (src) => {
			if (!isAValidGithubSource(src)) {
				return 'Invalid github source';
			}
			return true;
		},
	});
};
