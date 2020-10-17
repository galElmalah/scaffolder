import * as vscode from "vscode";
import { generateScaffolderFromGithub } from "./generateScaffolderFromGithub";
import { generateScaffolderTemplate } from "./generateScaffolderTemplate";
import { logger } from "./logger";

//Create output channel

export function activate(context: vscode.ExtensionContext) {
  const whenClickingOnFolderCommand = vscode.commands.registerCommand(
    "scaffolder-vscode.createTemplateInFolder",
    (uri: vscode.Uri) => {
      generateScaffolderTemplate(uri.fsPath);
    }
  );

  const whenClickingOnFileCommand = vscode.commands.registerCommand(
    "scaffolder-vscode.createTemplateInFile",
    (uri: vscode.Uri) => {
      let directoryPath = uri.fsPath.split("/");
      directoryPath.pop();
      (directoryPath as any) = directoryPath.join("/");
      generateScaffolderTemplate(directoryPath as any);
    }
  );

  const generatingTemplateFromGithub = vscode.commands.registerCommand(
    "scaffolder-vscode.createTemplateFromGithub",
    () => {
      generateScaffolderFromGithub(vscode.workspace.rootPath);
    }
  );

  context.subscriptions.push(
    whenClickingOnFolderCommand,
    whenClickingOnFileCommand,
    generatingTemplateFromGithub
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
