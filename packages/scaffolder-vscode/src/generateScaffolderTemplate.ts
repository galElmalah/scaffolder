import * as vscode from "vscode";
import {
  commandsBuilder,
  templateReader,
  extractAllKeysFromTemplate,
  templateTransformer,
  injector,
  TemplatesBuilder,
  asyncExecutor,
  Config,
  IConfig,
  contextFactory
} from "scaffolder-core";
import { chooseTemplate } from "./chooseTemplate";
import { errorHandler } from "./errorHandler";
import { getParamsValuesFromUser } from "./getParamsValuesFromUser";
import { scaffolderMessage } from "./scaffolderMessage";
import { logger, makeLogger } from "./logger";

const validateScaffolderConfig = (config: IConfig) => {
  try {
    config.validateConfig();
  } catch (e) {
    vscode.window.showInformationMessage(
      scaffolderMessage(`You "scaffolder.config.js" files seems to include some miss configured fields.\nCheck the output console for more information.`)
    );
    logger.log(e.message);
  }
};

export const generateScaffolderTemplate = async (
  path: string,
  generateTo = ""
) => {
  generateTo = generateTo || path;
  try {
    const availableTemplateCommands = commandsBuilder(path);
    const chosenTemplate = await chooseTemplate(availableTemplateCommands);

    if (!chosenTemplate) {
      return;
    }

    const { config: configObject, currentCommandTemplate } = templateReader(
      availableTemplateCommands
    )(chosenTemplate);

    const config = new Config(configObject).forTemplate(chosenTemplate);

    validateScaffolderConfig(config);


    const {
      preAskingQuestions,
      preTemplateGeneration,
      postTemplateGeneration,
    } = config.get.hooks();

    const baseCtx = {
      parametersValues: {},
      templateName: chosenTemplate,
      templateRoot: availableTemplateCommands[chosenTemplate],
      targetRoot: generateTo,
      logger: makeLogger()
    };

    const makeContext = contextFactory(baseCtx);

    await asyncExecutor(
      preAskingQuestions,
      () =>
        logger.log(
          `Executed "${chosenTemplate}" pre-asking questions hook.`
        ),
      (e: Error) =>
        logger.log(
          `Error while Executing "${chosenTemplate}" pre-asking questions hook::\n${e}`
        ),
      makeContext()
    );

    const templateKeys = extractAllKeysFromTemplate(currentCommandTemplate);

    const parametersValues = await getParamsValuesFromUser(templateKeys, config);

    const globalCtx = makeContext({ parametersValues });

    const templates = templateTransformer(
      currentCommandTemplate,
      injector(parametersValues, config, globalCtx),
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
