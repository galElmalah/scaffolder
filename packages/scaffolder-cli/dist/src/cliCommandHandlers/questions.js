"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = require("inquirer");
const scaffolder_core_1 = require("scaffolder-core");
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
    return inquirer_1.default.prompt([
        Object.assign(Object.assign({}, QUESTIONS.TEMPLATES), { choices }),
    ]);
};
const getQuestionMessage = (parametersOptions = {}, key) => {
    return ((parametersOptions[key] && parametersOptions[key].question) ||
        `Enter a value for the following parameter "${key}"`);
};
const getValidationFunction = (parametersOptions = {}, key) => {
    const validationFn = parametersOptions[key] && parametersOptions[key].validation;
    if (!validationFn) {
        return;
    }
    return validationFn;
};
const extractAllKeysFromTemplate = (currentCommandTemplate) => {
    const keySet = new Set();
    const keys = scaffolder_core_1.getAllKeys(currentCommandTemplate, keySet);
    return keys.filter(Boolean);
};
const getKeysValues = (currentCommandTemplate, parametersOptions) => {
    const questions = extractAllKeysFromTemplate(currentCommandTemplate).map((key) => {
        const cleanKey = scaffolder_core_1.extractKey(key);
        return {
            type: 'input',
            name: cleanKey,
            message: getQuestionMessage(parametersOptions, cleanKey),
            validate: getValidationFunction(parametersOptions, cleanKey)
        };
    });
    return inquirer_1.default.prompt(questions);
};
// eslint-disable-next-line no-useless-escape
const isAValidGithubSource = (src) => /(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/.test(src);
const getRepositorySource = () => {
    return inquirer_1.default.prompt({
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
module.exports = {
    getRepositorySource,
    getKeysValues,
    chooseTemplate,
    getQuestionMessage,
    shouldCreateAFolder,
    extractAllKeysFromTemplate,
    getValidationFunction,
    isAValidGithubSource
};
//# sourceMappingURL=questions.js.map