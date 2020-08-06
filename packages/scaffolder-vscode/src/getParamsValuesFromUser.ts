import {
  getQuestionMessage,
  extractKey,
  getValidationFunction,
} from "scaffolder-cli";
import * as vscode from "vscode";

const vscodeValidationFunctionAdapter = (parametersOptions: {}, key:string) => {
  const validationFn = getValidationFunction(parametersOptions, key);
  if (validationFn) {
    return (value: string) => {
      const result = validationFn(value);
      if (typeof result === "string") {
        return result;
      }
    };
  }
};

export const getParamsValuesFromUser = async (
  templateKeys: string[],
  config: any
) => {
  const paramsValues = {};
  for (let param of templateKeys) {
    const cleanKey = extractKey(param);
    const paramValue = await vscode.window.showInputBox({
      prompt: getQuestionMessage(config.parametersOptions, cleanKey),
      placeHolder: `Enter value (${templateKeys.indexOf(param) + 1}/${
        templateKeys.length
      })`,
      validateInput: vscodeValidationFunctionAdapter(
        config.parametersOptions,
        cleanKey
      ),
    });
    // @ts-ignore
    paramsValues[extractKey(param)] = paramValue;
  }
  return paramsValues;
};
