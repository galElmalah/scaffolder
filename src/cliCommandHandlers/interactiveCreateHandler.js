const chooseTemplate = () => {
  const choices = Object.keys(commandsBuilder(process.cwd()));
  return inquirer.prompt([{
    type: "list",
    name: "TEMPLATES",
    message: "Choose the template you want to create.",
    choices,
  }])
}

const fillKeys = (templateName) => {
  const templates = commandsBuilder(process.cwd());
  const currentCommandTemplate = templateReader(templates)(templateName);
  return inquirer.prompt([{
    type: "list",
    name: "TEMPLATES",
    message: "Choose the template you want to create.",
    choices,
  }])
}

const interactiveCreateCommandHandler = async (command, cmd) => {
  try {


    const commandName = await chooseTemplate();
    const keys = await fillKeys(commandName['TEMPLATES'])
    const templates = getTransformedTemplates(command, cmd);
    const templatesBuilder = new TemplatesBuilder(templates, command);
    cmd.folder && templatesBuilder.inAFolder(cmd.folder);
    cmd.entryPoint && templatesBuilder.withCustomEntryPoint(cmd.entryPoint)

    return Promise.all(templatesBuilder.create()).then(() => {
      showSuccessMessage(command, templatesBuilder.getFullPath());
    });
  } catch (err) {
    handleError(err);
  }
};

module.exports = {
  interactiveCreateCommandHandler
}