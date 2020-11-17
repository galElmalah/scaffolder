import {
  getQuestionMessage,
  extractKey,
  getValidationFunction,
  IConfig,
} from "scaffolder-core";
import * as vscode from "vscode";
import { validationAdapter } from "./generateScaffolderFromGithub";

const vscodeValidationFunctionAdapter = (
  validationFn: any
) => {
  if (validationFn) {
    return validationAdapter(validationFn);
  }
};

export const getParamsValuesFromUser = async (
  templateKeys: string[],
  config: IConfig
) => {
  const paramsValues = {};
  for (let param of templateKeys) {
    const cleanKey = extractKey(param);
    const parameterOptions = config.get.parameterOptions(cleanKey);
    const paramValue = await vscode.window.showInputBox({
      prompt: parameterOptions.question,
      placeHolder: `Enter value (${templateKeys.indexOf(param) + 1}/${
        templateKeys.length
      })`,
      validateInput: vscodeValidationFunctionAdapter(parameterOptions.validation)
    });
    // @ts-ignore
    paramsValues[extractKey(param)] = paramValue;
  }
  return paramsValues;
};
