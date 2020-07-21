const fs = require("fs");
const {
  NoMatchingTemplate,
  MissingKeyValuePairs,
  MissingTransformerImplementation,
} = require("../../Errors");
const { isFolder, join, TYPES } = require("../filesUtils");

const defaultConfig = () => ({ transformers: {} });

const extractKey = (k) => k.replace(/({|})/g, "").trim();

const applyTranformers = (initialValue, transformersMap, transformersKeys) => {
  return transformersKeys
    .map((t) => t.trim())
    .reduce((currValue, nextTranformerKey) => {
      const transformerFunction = transformersMap[nextTranformerKey];
      if (!transformerFunction) {
        throw new MissingTransformerImplementation({
          transformationKey: nextTranformerKey,
        });
      }
      return transformerFunction(currValue);
    }, initialValue);
};

const getKeyAndTranformers = (initialKey) =>
  extractKey(initialKey)
    .split("|")
    .map((_) => _.trim());

const replaceKeyWithValue = (keyValuePairs, transformersMap) => (match) => {
  const [key, ...tranformersKeys] = getKeyAndTranformers(match);

  if (!keyValuePairs.hasOwnProperty(key)) {
    throw new MissingKeyValuePairs(match);
  }

  const keyInitialValue = keyValuePairs[key];

  return tranformersKeys
    ? applyTranformers(keyInitialValue, transformersMap, tranformersKeys)
    : keyInitialValue;
};

const createTemplateStructure = (folderPath) => {
  const folderContent = fs.readdirSync(folderPath);
  return folderContent.map((file) => {
    if (isFolder(folderPath, file)) {
      return {
        type: TYPES.FOLDER,
        name: file,
        content: createTemplateStructure(join(folderPath, file)),
      };
    }
    return {
      name: file,
      content: fs.readFileSync(join(folderPath, file)).toString(),
    };
  });
};
const getConfigPath = (path) =>
  path.split("/").slice(0, -1).join("/") + "/scaffolder.config.js";

const templateReader = (commands) => (cmd) => {
  let config = defaultConfig();
  if (!commands[cmd]) {
    throw new NoMatchingTemplate(cmd);
  }

  if (fs.existsSync(getConfigPath(commands[cmd]))) {
    config = require(getConfigPath(commands[cmd]));
  }

  return {
    config,
    currentCommandTemplate: createTemplateStructure(commands[cmd]),
  };
};

const templateTransformer = (templateDescriptor, injector) => {
  return templateDescriptor.map((descriptor) => {
    if (descriptor.type === TYPES.FOLDER) {
      return {
        type: descriptor.type,
        name: injector(descriptor.name),

        content: templateTransformer(descriptor.content, injector),
      };
    }
    return {
      name: injector(descriptor.name),
      content: injector(descriptor.content),
    };
  });
};

//@ts-ignore
const keyPatternString = "{{s*[a-zA-Z_|0-9- ]+s*}}";

const injector = (keyValuePairs, tranformersMap) => (text) => {
  const keyPattern = new RegExp(keyPatternString, "g");
  const replacer = replaceKeyWithValue(keyValuePairs, tranformersMap);
  const transformedText = text.replace(keyPattern, replacer);
  return transformedText;
};

module.exports = {
  templateReader,
  templateTransformer,
  injector,
  join,
  keyPatternString,
  extractKey,
};
