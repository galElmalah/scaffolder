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
} from "scaffolder-core";
import { chooseTemplate } from "./chooseTemplate";
import { errorHandler } from "./errorHandler";
import { getParamsValuesFromUser } from "./getParamsValuesFromUser";
import { scaffolderMessage } from "./scaffolderMessage";
import { logger } from "./logger";

export const generateScaffolderTemplate = async (
  path: string,
  generateTo = ""
) => {
  generateTo = generateTo || path;
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
      // @ts-ignore
      templateRoot: availableTemplateCommands[chosenTemplate],
      targetRoot: generateTo,
    };

    const templates = templateTransformer(
      currentCommandTemplate,
      injector(paramsValues, config, globalCtx),
      globalCtx
    );

    const templatesBuilder = new TemplatesBuilder(
      templates,
      chosenTemplate
    ).withCustomEntryPoint(generateTo);

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
      scaffolderMessage(`Generated "${chosenTemplate}" at - ${generateTo}`)
    );
  } catch (e) {
    errorHandler(e, logger.log);
  }
};
