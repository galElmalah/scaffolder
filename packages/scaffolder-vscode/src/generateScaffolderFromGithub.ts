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

  try {
    const githubSrc = await chooseGithubSource();

    if (!githubSrc) {
      return;
    }

    const gitCloner = new GithubTempCloner(githubSrc, logger.log);
    vscode.window.showInformationMessage("cloning repository...");
    const githubTempFolderPath = gitCloner.clone();
    generateScaffolderTemplate(githubTempFolderPath, generateTo);
  } catch (e) {
    logger.log(e);
  }
};
