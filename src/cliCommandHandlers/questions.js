const inquirer = require("inquirer");
const { extractKey, keyPatternString } = require("../createTemplateStructure");
const {
  removeTransformationsFromKey,
} = require("../createTemplateStructure/applyTransformers");
const { TYPES } = require("../filesUtils");

const QUESTIONS = {
  TEMPLATES: {
    type: "list",
    name: "chosenTemplate",
    message: "Choose the template you want to create.",
  },
};

const keyPattern = /{{\s*\w+\s*}}/gi;

const getAllKeys = (templates, set) => {
  templates.forEach(({ name, content, type }) => {
    const keyRegex = new RegExp(keyPatternString, "gi");
    if (type === TYPES.FOLDER) {
      const nameKeys = name.match(keyRegex) || [];
      nameKeys.forEach((k) => set.add(k));
      getAllKeys(content, set).forEach((k) => set.add(k));
      return;
    }
    const nameKeys = name.match(keyRegex) || [];
    const contentKeys = content.match(keyRegex) || [];
    [...nameKeys, ...contentKeys]
      .map(removeTransformationsFromKey)
      .forEach((k) => set.add(k));
  });
  return Array.from(set.keys());
};

const shouldCreateAFolder = (answer = "") => {
  const _answer = answer.toLowerCase();
  return _answer === "y" || _answer === "yes";
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

const getKeysValues = (currentCommandTemplate) => {
  const keySet = new Set();
  const keys = getAllKeys(currentCommandTemplate, keySet);
  const questions = keys.filter(Boolean).map((key) => ({
    type: "input",
    name: extractKey(key),
    message: `Enter a value for the following key ${key}`,
  }));
  return inquirer.prompt(questions);
};

const shouldGenerateTemplateInAFolder = () => {
  return inquirer.prompt({
    type: "input",
    name: "inAFolder",
    message: `should generate the template inside a folder?(y/n)`,
  });
};

const getFolderName = () => {
  return inquirer.prompt({
    type: "input",
    name: "folderName",
    message: `Enter the name of the folder you wish the template will be generated into:`,
  });
};

module.exports = {
  getFolderName,
  shouldGenerateTemplateInAFolder,
  getKeysValues,
  chooseTemplate,
  shouldCreateAFolder,
  getAllKeys,
};
