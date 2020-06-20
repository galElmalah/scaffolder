const {
  templateReader,
  templateTransformer,
  injector: _injector,
} = require("../createTemplateStructure");
const { commandsBuilder } = require("../commandsBuilder");
const TemplatesBuilder = require("../TemplatesBuilder");
const { handleError, showSuccessMessage } = require("../cliHelpers");
const path = require("path");
const {
  getKeysValues,
  getFolderName,
  chooseTemplate,
  shouldCreateAFolder,
  shouldGenerateTemplateInAFolder,
} = require("./questions");

const interactiveCreateCommandHandler = async (command, cmd) => {
  try {
    const availableTemplateCommands = await commandsBuilder(process.cwd());
    const { chosenTemplate } = await chooseTemplate(availableTemplateCommands);

    const currentCommandTemplate = templateReader(availableTemplateCommands)(
      chosenTemplate
    );

    const keys = await getKeysValues(currentCommandTemplate);

    const templates = templateTransformer(
      currentCommandTemplate,
      _injector(keys)
    );
    const templatesBuilder = new TemplatesBuilder(templates, chosenTemplate);

    if (command.entryPoint) {
      templatesBuilder.withCustomEntryPoint(command.entryPoint);
    }

    const { inAFolder } = await shouldGenerateTemplateInAFolder();
    if (shouldCreateAFolder(inAFolder)) {
      const { folderName } = await getFolderName();
      templatesBuilder.inAFolder(folderName);
    }

    // cmd.folder && templatesBuilder.inAFolder(cmd.folder);
    // cmd.entryPoint && templatesBuilder.withCustomEntryPoint(cmd.entryPoint)

    return Promise.all(templatesBuilder.build()).then(() => {
      showSuccessMessage(chosenTemplate, templatesBuilder.getFullPath());
    });
  } catch (err) {
    handleError(err);
  }
};

module.exports = {
  interactiveCreateCommandHandler,
};
