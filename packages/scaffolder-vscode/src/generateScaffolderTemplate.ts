import * as vscode from "vscode";
import {
  commandsBuilder,
  templateReader,
  extractAllKeysFromTemplate,
  templateTransformer,
  injector,
  TemplatesBuilder,
  asyncExecutor,
  getTemplateHooksFromConfig,
} from "scaffolder-cli";
import { chooseTemplate } from "./chooseTemplate";
import { errorHandler } from "./errorHandler";
import { getParamsValuesFromUser } from "./getParamsValuesFromUser";
import { scaffolderMessage } from "./scaffolderMessage";
import { logger } from "./logger";

export const generateScaffolderTemplate = async (path: string) => {
  try {
    const availableTemplateCommands = await commandsBuilder(path);
    const chosenTemplate = await chooseTemplate(availableTemplateCommands);

    if (!chosenTemplate) {
      return;
    }

    const { config, currentCommandTemplate } = templateReader(
      availableTemplateCommands
    )(chosenTemplate);

    const {
      preTemplateGeneration,
      postTemplateGeneration,
    } = getTemplateHooksFromConfig(config, chosenTemplate);

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

    await asyncExecutor(
      preTemplateGeneration,
      () =>
        logger.log(
          `Executed "${chosenTemplate}" pre-template generation hook.`
        ),
      (e: Error) =>
        logger.log(
          `Error while Executing "${chosenTemplate}" pre-template generation hook::\n${e}`
        ),
      globalCtx
    );

    await Promise.all(templatesBuilder.build());

    await asyncExecutor(
      postTemplateGeneration,
      () =>
        logger.log(
          `Executed "${chosenTemplate}" post-template generation hook.`
        ),
      (e: Error) =>
        logger.log(
          `Error while Executing "${chosenTemplate}" post-template generation hook::\n${e}`
        ),
      globalCtx
    );

    vscode.window.showInformationMessage(
      scaffolderMessage(`Generated "${chosenTemplate}" at - ${path}`)
    );
  } catch (e) {
    errorHandler(e, logger.log);
  }
};
