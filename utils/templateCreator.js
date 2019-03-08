const fs = require('fs');
const path = require('path');

const join = (...args) => path.join(...args);

const extractKey = k => k.replace(/({|})/g, '');

replaceKeyWithValue = keyValuePairs => match => {
  const key = extractKey(match);
  if (!keyValuePairs[key]) {
    throw new Error(`No matching key value for the following:: ${match}`);
  }
  return keyValuePairs[key];
};

const templateReader = commands => cmd => {
  const files = fs.readdirSync(commands[cmd]);
  const fileObjects = files.map(file => ({
    name: file,
    content: fs.readFileSync(join(commands[cmd], file)).toString(),
  }));

  return fileObjects;
};

const templateTransformer = (templateDescriptor, injector) =>
  templateDescriptor.map(file => ({
    name: injector(file.name),
    content: injector(file.content),
  }));

const injector = keyValuePairs => text => {
  const keyPattern = /{{\w+}}/g;
  const replacer = replaceKeyWithValue(keyValuePairs);

  const transformedText = text.replace(keyPattern, replacer);
  return transformedText;
};

module.exports = { templateReader, templateTransformer, injector, join };
