const inquirer = require("inquirer");
const { extractKey, keyPatternString } = require("../createTemplateStructure");
const {
  removeTransformationsFromKey,
} = require("../createTemplateStructure/applyTransformers");
const { TYPES } = require("../filesUtils");
const { isAFunctionKey } = require("../createTemplateStructure/");

const QUESTIONS = {
  TEMPLATES: {
    type: "list",
    name: "chosenTemplate",
    message: "Choose the template you want to create.",
  },
};

const fillSetWithKeys = (keys, set) => {
  keys
    .filter((k) => !isAFunctionKey(k))
    .map(removeTransformationsFromKey)
    .forEach((k) => set.add(k));
};

const getAllKeys = (templates, set) => {
  templates.forEach(({ name, content, type }) => {
    const keyRegex = new RegExp(keyPatternString, "gi");
    if (type === TYPES.FOLDER) {
      const nameKeys = name.match(keyRegex) || [];
      fillSetWithKeys(nameKeys, set);
      getAllKeys(content, set).forEach((k) => set.add(k));
      return;
    }
    const nameKeys = name.match(keyRegex) || [];
    const contentKeys = content.match(keyRegex) || [];
    fillSetWithKeys([...nameKeys, ...contentKeys], set);
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

const getKeysValues = (currentCommandTemplate, keysToQuestionMap) => {
  const keySet = new Set();
  const keys = getAllKeys(currentCommandTemplate, keySet);
  const questions = keys.filter(Boolean).map((key) => {
    const cleanKey = extractKey(key);
    return {
      type: "input",
      name: cleanKey,
      message:
        keysToQuestionMap[cleanKey] ||
        `Enter a value for the following key ${key}`,
    };
  });
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
