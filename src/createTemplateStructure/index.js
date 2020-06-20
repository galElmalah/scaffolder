const fs = require("fs");
const path = require("path");
const { NoMatchingTemplate, MissingKeyValuePairs } = require("../../Errors");
const { isFolder, join, TYPES } = require("../filesUtils");

const extractKey = (k) => k.replace(/({|})/g, "").trim();

replaceKeyWithValue = (keyValuePairs) => (match) => {
  const key = extractKey(match);
  if (!keyValuePairs[key]) {
    throw new MissingKeyValuePairs(match);
  }

  return keyValuePairs[key];
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

const templateReader = (commands) => (cmd) => {
  if (!commands[cmd]) {
    throw new NoMatchingTemplate(cmd);
  }
  return createTemplateStructure(commands[cmd]);
};

const templateTransformer = (templateDescriptor, injector) =>
  templateDescriptor.map((descriptor) => {
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

const injector = (keyValuePairs) => (text) => {
  const keyPattern = /{{\s*\w+\s*}}/g;
  const replacer = replaceKeyWithValue(keyValuePairs);
  const transformedText = text.replace(keyPattern, replacer);
  return transformedText;
};

module.exports = {
  templateReader,
  templateTransformer,
  injector,
  join,
  extractKey,
};
