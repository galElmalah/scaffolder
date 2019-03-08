#!/usr/bin/env node
const cli = require('commander');
const {
  templateReader,
  templateTransformer,
  injector: _injector,
} = require('./utils/templateCreator');
const commandsBuilder = require('./utils/commandsBuilder');
const TemplatesBuilder = require('./utils/templateBuilder');
const {
  generateKeyValues,
  showErrorMessage,
  showSuccessMessage,
} = require('./utils/cliHelpers');

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
  .option(
    '-f, --folder [value]',
    'Folder name that the template will be generated into'
  )
  .alias('c')
  .description('Create template folder structure')
  .action((command, cmd) => {
    const { templates } = getTransformedTemplates(command, cmd);
    const templateBuilder = new TemplatesBuilder(templates);
    const folder = cmd.folder;
    try {
      if (folder) {
        templateBuilder.inAFolder(folder);
      }
      Promise.all(templateBuilder.create()).then(() => {
        showSuccessMessage(command, templateBuilder.getFullPath());
      });
    } catch (err) {
      showErrorMessage(command, folder, templateBuilder.getFullPath());
    }
  });

cli.parse(process.argv);
