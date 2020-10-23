import inquirer from 'inquirer';
import { getAllKeys, extractKey } from 'scaffolder-core';

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
	const validationFn = parametersOptions[key] && parametersOptions[key].validation;
	if (!validationFn) {
		return;
	}
	return validationFn;

};

export const extractAllKeysFromTemplate = (currentCommandTemplate) => {
	const keySet = new Set();
	const keys = getAllKeys(currentCommandTemplate, keySet);
	return keys.filter(Boolean);
};

export const getKeysValues = (currentCommandTemplate, parametersOptions) => {
	const questions = extractAllKeysFromTemplate(currentCommandTemplate).map((key) => {
		const cleanKey = extractKey(key);
		return {
			type: 'input',
			name: cleanKey,
			message: getQuestionMessage(parametersOptions, cleanKey),
			validate: getValidationFunction(parametersOptions, cleanKey)
		};
	});
	return inquirer.prompt(questions);
};

// eslint-disable-next-line no-useless-escape
export const isAValidGithubSource = (src) => /(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/.test(src);

export const getRepositorySource = () => {
	return inquirer.prompt({
		type: 'input',
		name: 'repositorySource',
		message: 'Enter the src of the repository you want to consume templates from:',
		validate: (src) => {
			if (!isAValidGithubSource(src)) {
				return 'Invalid github source';
			}
			return true;
		}
	});
};
