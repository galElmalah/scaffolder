import {
  generateKeyValues,
  handleError,
  showSuccessMessage,
  displayAvailableCommands,
  displaySpecificCommandTemplate,
} from '../cliHelpers';

import { getValidationFunction } from './questions';
import {
  asyncExecutor,
  getTemplateHooksFromConfig,
  TemplatesBuilder,
  commandsBuilder,
  templateReader,
  templateTransformer,
  injector,
} from 'scaffolder-core';

export { interactiveCreateCommandHandler } from './interactiveCreateHandler';

const validateParametersValues = (parametersOptions, keyValuePairs) => {
  for (const [parameter, value] of Object.entries(keyValuePairs)) {
    const validationFn = getValidationFunction(parametersOptions, parameter);
    if (validationFn) {
      const res = validationFn(value);
      if (typeof res === 'string') {
        throw new Error(`invalid value for "${parameter}"::${res}`);
      }
    }
  }
};

const getTransformedTemplates = (command, cmd) => {
  const commandsLocations = commandsBuilder(cmd.loadFrom || process.cwd());

  const { config, currentCommandTemplate } = templateReader(commandsLocations)(
    command
  );

  const keyValuePairs = generateKeyValues(cmd);

  validateParametersValues(config.parametersOptions, keyValuePairs);

  const globalCtx = {
    templateName: command,
    templateRoot: commandsLocations[command],
    parametersValues: keyValuePairs,
    targetRoot: cmd.entryPoint || process.cwd(),
  };

  const _injector = injector(keyValuePairs, config, globalCtx);
  const transformedTemplate = templateTransformer(
    currentCommandTemplate,
    _injector,
    globalCtx
  );

  return {
    transformedTemplate,
    config,
    globalCtx,
  };
};

export const createCommandHandler = async (command, cmd) => {
  try {
    const {
      transformedTemplate: templates,
      config,
      globalCtx,
    } = getTransformedTemplates(command, cmd);

    const {
      preTemplateGeneration,
      postTemplateGeneration,
    } = getTemplateHooksFromConfig(config, command);

    const templatesBuilder = new TemplatesBuilder(templates, command);
    cmd.folder && templatesBuilder.inAFolder(cmd.folder);
    cmd.entryPoint && templatesBuilder.withCustomEntryPoint(cmd.entryPoint);
    cmd.pathPrefix && templatesBuilder.withPathPrefix(cmd.pathPrefix);

    await asyncExecutor(
      preTemplateGeneration,
      `Executed "${command}" pre-template generation hook.`,
      (e) =>
        `Error while Executing "${command}" pre template generation hook::\n${e}`,
      globalCtx
    );

    await Promise.all(templatesBuilder.build());

    showSuccessMessage(command, templatesBuilder.getFullPath());
    asyncExecutor(
      postTemplateGeneration,
      `Executed "${command}" post-template generation hook.`,
      (e) =>
        `Error while Executing "${command}" post-template generation hook::\n${e}`,
      globalCtx
    );
  } catch (err) {
    handleError(err);
  }
};

export const listCommandHandler = (command) => {
  const entryPoint = command.entryPoint || process.cwd();
  const commands = commandsBuilder(entryPoint);
  displayAvailableCommands(commands);
};

export const showCommandHandler = (command, cmd) => {
  const commandsLocations = commandsBuilder(process.cwd());
  const { currentCommandTemplate } = templateReader(commandsLocations)(command);

  displaySpecificCommandTemplate(currentCommandTemplate, cmd.showContent);
};


