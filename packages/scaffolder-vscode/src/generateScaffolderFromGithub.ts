import * as vscode from "vscode";
import { GithubTempCloner, isAValidGithubSource } from "scaffolder-cli";
import { generateScaffolderTemplate } from "./generateScaffolderTemplate";
import { logger } from "./logger";

export const validationAdapter = (fn: () => any) => (
  value: any
): undefined | string => {
  const result = isAValidGithubSource(value);
  if (typeof result === "string") {
    return result;
  }
};

export const generateScaffolderFromGithub = async () => {
  const chooseGithubSource = () => {
    return vscode.window.showInputBox({
      prompt: "Enter a Github src (ssh/https)",
      placeHolder: `https://github.com/galElmalah/scaffolder-templates-example.git`,
      validateInput: validationAdapter(isAValidGithubSource),
    });
  };
  const githubSrc = await chooseGithubSource();
  const gitCloner = new GithubTempCloner(githubSrc, logger.log);
  const githubTempFolderPath = gitCloner.clone();
  logger.log({ githubTempFolderPath });
  generateScaffolderTemplate(githubTempFolderPath);
};
