import * as vscode from "vscode";

const scaffolderOutChannel = vscode.window.createOutputChannel("Scaffolder");

export const logger = {
  log: (str: string) => scaffolderOutChannel.appendLine(str),
};
