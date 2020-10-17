import * as vscode from "vscode";

const scaffolderOutChannel = vscode.window.createOutputChannel("Scaffolder");

export const logger = {
  log: (str: any) => scaffolderOutChannel.appendLine(str),
};
