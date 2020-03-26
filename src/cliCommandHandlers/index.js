const inquirer = require('inquirer')
const {
  templateReader,
  templateTransformer,
  injector: _injector,
} = require('../templatesCreator');
const { commandsBuilder } = require('../commandsBuilder');
const TemplatesBuilder = require('../TemplatesBuilder');
const {
  generateKeyValues,
  handleError,
  showSuccessMessage,
  displayAvailableCommands,
  displaySpecificCommandTemplate,
} = require('../cliHelpers');
const { interactiveCreateCommandHandler } = require('./interactiveCreateHandler');

const getTransformedTemplates = (command, cmd) => {
  const commandsLocations = commandsBuilder(cmd.loadFrom || process.cwd());

  const currentCommandTemplate = templateReader(commandsLocations)(command);
  const keyValuePairs = generateKeyValues(cmd);
  const injector = _injector(keyValuePairs);
  const transformedTemplate = templateTransformer(
    currentCommandTemplate,
    injector
  );
  return transformedTemplate;
};

const createCommandHandler = (command, cmd) => {
  try {

    const templates = getTransformedTemplates(command, cmd);
    const templatesBuilder = new TemplatesBuilder(templates, command);
    cmd.folder && templatesBuilder.inAFolder(cmd.folder);
    cmd.createAt && templatesBuilder.withCustomEntryPoint(cmd.entryPoint)

    return Promise.all(templatesBuilder.create()).then(() => {
      showSuccessMessage(command, templatesBuilder.getFullPath());
    });
  } catch (err) {
    handleError(err);
  }
};

const listCommandHandler = () => {
  const commands = commandsBuilder(process.cwd());
  displayAvailableCommands(commands);
};

const showCommandHandler = (command, cmd) => {
  const commandsLocations = commandsBuilder(process.cwd());
  const currentCommandTemplate = templateReader(commandsLocations)(command);
  displaySpecificCommandTemplate(currentCommandTemplate, cmd.showContent);
};



module.exports = {
  createCommandHandler,
  listCommandHandler,
  showCommandHandler,
  interactiveCreateCommandHandler
};
