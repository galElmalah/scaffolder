import * as scaffolder from "scaffolder-cli";
import * as vscode from "vscode";

export const getParamsValuesFromUser = async (
  templateKeys: string[],
  config: any
) => {
  const paramsValues = {};
  for (let param of templateKeys) {
    const cleanKey = scaffolder.extractKey(param);
    const paramValue = await vscode.window.showInputBox({
      prompt: scaffolder.getQuestionMessage(config.parametersOptions, cleanKey),
      placeHolder: `Enter value (${templateKeys.indexOf(param) + 1}/${
        templateKeys.length
      })`,
    });
    // @ts-ignore
    paramsValues[scaffolder.extractKey(param)] = paramValue;
  }
  return paramsValues;
};
