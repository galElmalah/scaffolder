import { getQuestionMessage, extractKey } from "scaffolder-cli";
import * as vscode from "vscode";

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
    });
    // @ts-ignore
    paramsValues[extractKey(param)] = paramValue;
  }
  return paramsValues;
};
