const inquirer = require('inquirer');
const { extractKey } = require('../createTemplateStructure');
const {getAllKeys} = require('./getAllKeys');


const QUESTIONS = {
	TEMPLATES: {
		type: 'list',
		name: 'chosenTemplate',
		message: 'Choose the template you want to create.',
	},
};



const shouldCreateAFolder = (answer = '') => {
	const _answer = answer.toLowerCase();
	return _answer === 'y' || _answer === 'yes';
};

const chooseTemplate = (commands) => {
	const choices = Object.keys(commands);
	return inquirer.prompt([
		{
			...QUESTIONS.TEMPLATES,
			choices,
		},
	]);
};

const getQuestionMessage = (parametersOptions = {}, key) => {
	return (
		(parametersOptions[key] && parametersOptions[key].question) ||
    `Enter a value for the following key "${key}"`
	);
};

const extractAllKeysFromTemplate = (currentCommandTemplate) => {
	const keySet = new Set();
	const keys = getAllKeys(currentCommandTemplate, keySet);
	return keys.filter(Boolean);
};

const getKeysValues = (currentCommandTemplate, parametersOptions) => {
	const questions = extractAllKeysFromTemplate(currentCommandTemplate).map((key) => {
		const cleanKey = extractKey(key);
		return {
			type: 'input',
			name: cleanKey,
			message: getQuestionMessage(parametersOptions, cleanKey),
		};
	});
	return inquirer.prompt(questions);
};

const shouldGenerateTemplateInAFolder = () => {
	return inquirer.prompt({
		type: 'input',
		name: 'inAFolder',
		message: 'should generate the template inside a folder?(y/n)',
	});
};

const getFolderName = () => {
	return inquirer.prompt({
		type: 'input',
		name: 'folderName',
		message: 'Enter the name of the folder you wish the template will be generated into:',
	});
};

module.exports = {
	getFolderName,
	shouldGenerateTemplateInAFolder,
	getKeysValues,
	chooseTemplate,
	getQuestionMessage,
	shouldCreateAFolder,
	extractAllKeysFromTemplate
};
