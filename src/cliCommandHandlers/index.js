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
  displaySpecifcCommandTemplate,
} = require('../cliHelpers');

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

const createCommandHandler = (command, cmd) => {
  try {
    const templates = getTransformedTemplates(command, cmd);
    const templatesBuilder = new TemplatesBuilder(templates, command);
    const folder = cmd.folder;
    if (folder) {
      templatesBuilder.inAFolder(folder);
    }
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
  displaySpecifcCommandTemplate(currentCommandTemplate, cmd.showContent);
};

module.exports = {
  createCommandHandler,
  listCommandHandler,
  showCommandHandler,
};
