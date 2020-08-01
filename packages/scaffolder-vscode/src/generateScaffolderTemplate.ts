import { chooseTemplate } from "./chooseTemplate";
import { errorHandler } from "./errorHandler";
import { getParamsValuesFromUser } from "./getParamsValuesFromUser";
import { scaffolderMessage } from "./scaffolderMessage";
import {
  commandsBuilder,
  templateReader,
  extractAllKeysFromTemplate,
  templateTransformer,
  injector,
  TemplatesBuilder,
} from "scaffolder-cli";
import * as vscode from "vscode";

const scaffolderOut = vscode.window.createOutputChannel("Scaffolder");

export const generateScaffolderTemplate = async (path: string) => {
  try {
    const availableTemplateCommands = await commandsBuilder(path);
    const chosenTemplate = await chooseTemplate(availableTemplateCommands);

    const { config, currentCommandTemplate } = templateReader(
      availableTemplateCommands
    )(chosenTemplate);

    const templateKeys = extractAllKeysFromTemplate(currentCommandTemplate);

    const paramsValues = await getParamsValuesFromUser(templateKeys, config);

    const globalCtx = {
      parametersValues: paramsValues,
      templateName: chosenTemplate,
      templateRoot: availableTemplateCommands[chosenTemplate],
      targetRoot: path,
    };

    const templates = templateTransformer(
      currentCommandTemplate,
      injector(paramsValues, config, globalCtx),
      globalCtx
    );

    const templatesBuilder = new TemplatesBuilder(
      templates,
      chosenTemplate
    ).withCustomEntryPoint(path);

    await Promise.all(templatesBuilder.build());

    vscode.window.showInformationMessage(
      scaffolderMessage(`Generated "${chosenTemplate}" at - ${path}`)
    );
  } catch (e) {
    errorHandler(e, scaffolderOut);
  }
};
