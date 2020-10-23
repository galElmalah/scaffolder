import * as vscode from "vscode";
import { GithubTempCloner, isAValidGithubSource } from "scaffolder-core";
import { generateScaffolderTemplate } from "./generateScaffolderTemplate";
import { logger } from "./logger";

export const validationAdapter = (fn: (...args: any) => string | boolean) => (
  value: any
): undefined | string => {
  const result = fn(value);
  if (typeof result === "string") {
    return result;
  }
};

export const generateScaffolderFromGithub = async (generateTo: string = "") => {
  const chooseGithubSource = () => {
    return vscode.window.showInputBox({
      prompt: "Enter a Github src (ssh/https)",
      placeHolder: `https://github.com/galElmalah/scaffolder-templates-example.git`,
      validateInput: validationAdapter(isAValidGithubSource),
    });
  };
  const gitCloner = new GithubTempCloner('', logger.log);


  try {
    const githubSrc = await chooseGithubSource();
    if (!githubSrc) {
      return;
    }
    gitCloner.setSrc(githubSrc);

    vscode.window.showInformationMessage("Cloning repository...");
    const githubTempFolderPath = await gitCloner.clone();
    logger.log(JSON.stringify(gitCloner.getTempDirPath()));
    vscode.window.showInformationMessage("Finished cloning repository...");
    generateScaffolderTemplate(githubTempFolderPath, generateTo);
  } catch (e) {
    logger.log(JSON.stringify(gitCloner.getTempDirPath()));

    logger.log(e);
  }
};
