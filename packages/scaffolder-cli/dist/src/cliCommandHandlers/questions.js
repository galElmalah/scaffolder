"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var inquirer_1 = require("inquirer");
var scaffolder_core_1 = require("scaffolder-core");
var QUESTIONS = {
    TEMPLATES: {
        type: 'list',
        name: 'chosenTemplate',
        message: 'Choose the template you want to create.',
    },
};
var shouldCreateAFolder = function (answer) {
    if (answer === void 0) { answer = ''; }
    var _answer = answer.toLowerCase();
    return _answer === 'y' || _answer === 'yes';
};
var chooseTemplate = function (commands) {
    var choices = Object.keys(commands);
    return inquirer_1.default.prompt([
        __assign(__assign({}, QUESTIONS.TEMPLATES), { choices: choices }),
    ]);
};
var getQuestionMessage = function (parametersOptions, key) {
    if (parametersOptions === void 0) { parametersOptions = {}; }
    return ((parametersOptions[key] && parametersOptions[key].question) ||
        "Enter a value for the following parameter \"" + key + "\"");
};
var getValidationFunction = function (parametersOptions, key) {
    if (parametersOptions === void 0) { parametersOptions = {}; }
    var validationFn = parametersOptions[key] && parametersOptions[key].validation;
    if (!validationFn) {
        return;
    }
    return validationFn;
};
var extractAllKeysFromTemplate = function (currentCommandTemplate) {
    var keySet = new Set();
    var keys = scaffolder_core_1.getAllKeys(currentCommandTemplate, keySet);
    return keys.filter(Boolean);
};
var getKeysValues = function (currentCommandTemplate, parametersOptions) {
    var questions = extractAllKeysFromTemplate(currentCommandTemplate).map(function (key) {
        var cleanKey = scaffolder_core_1.extractKey(key);
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
var isAValidGithubSource = function (src) { return /(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/.test(src); };
var getRepositorySource = function () {
    return inquirer_1.default.prompt({
        type: 'input',
        name: 'repositorySource',
        message: 'Enter the src of the repository you want to consume templates from:',
        validate: function (src) {
            if (!isAValidGithubSource(src)) {
                return 'Invalid github source';
            }
            return true;
        }
    });
};
module.exports = {
    getRepositorySource: getRepositorySource,
    getKeysValues: getKeysValues,
    chooseTemplate: chooseTemplate,
    getQuestionMessage: getQuestionMessage,
    shouldCreateAFolder: shouldCreateAFolder,
    extractAllKeysFromTemplate: extractAllKeysFromTemplate,
    getValidationFunction: getValidationFunction,
    isAValidGithubSource: isAValidGithubSource
};
//# sourceMappingURL=questions.js.map