#!/usr/bin/env node
const cli = require('commander');
const {
  templateReader,
  templateTransformer,
  injector: _injector,
} = require('./utils/templateCreator');
const commandsBuilder = require('./utils/commandsBuilder');
const TemplatesBuilder = require('./utils/templateBuilder');
const { generateKeyValues } = require('./utils/cliHelpers');

const getTransformedTemplates = (command, cmd) => {
  const commandsLocations = commandsBuilder(process.cwd());
  const currentCommandTemplate = templateReader(commandsLocations)(command);
  const keyValuePairs = generateKeyValues(cmd);
  const injector = _injector(keyValuePairs);
  const transformedTemplate = templateTransformer(
    currentCommandTemplate,
    injector
  );
  return { templates: transformedTemplate, keyValuePairs };
};

cli
  .command('create <commandName>')
  .alias('c')
  .description('Create template folder structure')
  .action((command, cmd) => {
    const { templates, keyValuePairs } = getTransformedTemplates(command, cmd);
    const templateBuilder = new TemplatesBuilder(templates);
    if (keyValuePairs.folder) {
      templateBuilder.inAFolder(keyValuePairs.folder);
    }
    templateBuilder.create();
  });

cli.parse(process.argv);
