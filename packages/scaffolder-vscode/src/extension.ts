// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

function activateScaffolder(path: string) {
  const ctfCreateTemplateCommand = `scaff i --entry-point ${path}`;
  if (vscode.window.activeTerminal) {
    vscode.window.activeTerminal.sendText(ctfCreateTemplateCommand);
  } else {
    vscode.window
      .createTerminal("scaffolder")
      .sendText(`scaff i --entry-point ${path}`);
  }
}

export function activate(context: vscode.ExtensionContext) {
  const whenClickingOnFolderCommand = vscode.commands.registerCommand(
    "scaffolder-vscode.createTemplateInFolder",
    (uri: vscode.Uri) => {
      activateScaffolder(uri.fsPath);
    }
  );

  const whenClickingOnFileCommand = vscode.commands.registerCommand(
    "scaffolder-vscode.createTemplateInFile",
    (uri: vscode.Uri) => {
      let directoryPath = uri.fsPath.split("/");
      directoryPath.pop();
      (directoryPath as any) = directoryPath.join("/");
      activateScaffolder(directoryPath as any);
    }
  );

  context.subscriptions.push(
    whenClickingOnFolderCommand,
    whenClickingOnFileCommand
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
