#!/usr/bin/env node
const cli = require('commander');
const {
  templateReader,
  templateTransformer,
  injector: _injector,
} = require('./src/templatesCreator');
const { commandsBuilder } = require('./src/commandsBuilder');
const TemplatesBuilder = require('./src/TemplatesBuilder');
const {
  generateKeyValues,
  handleError,
  showSuccessMessage,
  displayAvailableCommands,
} = require('./src/cliHelpers');

const getTransformedTemplates = (command, cmd) => {
  const commandsLocations = commandsBuilder(process.cwd());
  const currentCommandTemplate = templateReader(commandsLocations)(command);
  const keyValuePairs = generateKeyValues(cmd);
  const injector = _injector(keyValuePairs);
  const transformedTemplate = templateTransformer(
    currentCommandTemplate,
    injector
  );
  return transformedTemplate;
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
    try {
      const templates = getTransformedTemplates(command, cmd);
      const templatesBuilder = new TemplatesBuilder(templates, command);
      const folder = cmd.folder;
      if (folder) {
        templatesBuilder.inAFolder(folder);
      }
      Promise.all(templatesBuilder.create()).then(() => {
        showSuccessMessage(command, templatesBuilder.getFullPath());
      });
    } catch (err) {
      handleError(err);
    }
  });

cli
  .command('list')
  .alias('ls')
  .description('Show all available commands and their paths')
  .action(() => {
    const commands = commandsBuilder(process.cwd());
    displayAvailableCommands(commands);
  });

cli.parse(process.argv);
