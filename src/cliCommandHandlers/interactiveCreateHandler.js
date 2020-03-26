const {
  templateReader,
  templateTransformer,
  injector: _injector,
} = require('../templatesCreator');
const { commandsBuilder } = require('../commandsBuilder');
const TemplatesBuilder = require('../TemplatesBuilder');
const {
  handleError,
  showSuccessMessage,
} = require('../cliHelpers');

const {
getKeysValues,
getFolderName,
chooseTemplate,
shouldCreateAFolder,
shouldGenerateTemplateInAFolder
} = require('./questions')


const interactiveCreateCommandHandler = async (command) => {
  try {
    const availableTemplateCommands = commandsBuilder(process.cwd());
    const {chosenTemplate} = await chooseTemplate(availableTemplateCommands)

    const currentCommandTemplate = templateReader(availableTemplateCommands)(chosenTemplate);
    const keys = await getKeysValues(currentCommandTemplate)

    const templates = templateTransformer(currentCommandTemplate, _injector(keys));
    const templatesBuilder = new TemplatesBuilder(templates, chosenTemplate);

    const {inAFolder} = await shouldGenerateTemplateInAFolder()
    if(shouldCreateAFolder(inAFolder)) {
      const {folderName} = await getFolderName();
      templatesBuilder.inAFolder(folderName);
    }

    // cmd.folder && templatesBuilder.inAFolder(cmd.folder);
    // cmd.entryPoint && templatesBuilder.withCustomEntryPoint(cmd.entryPoint)

    return Promise.all(templatesBuilder.create()).then(() => {
      showSuccessMessage(chosenTemplate, templatesBuilder.getFullPath());
    });
  } catch (err) {
    handleError(err);
  }
};

module.exports = {
  interactiveCreateCommandHandler
}

