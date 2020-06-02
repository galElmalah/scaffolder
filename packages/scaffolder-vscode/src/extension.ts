// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

function activateCtf(path: string) {
  const ctfCreateTemplateCommand = `ctf i --entry-point ${path}`;
  if (vscode.window.activeTerminal) {
    vscode.window.activeTerminal.sendText(ctfCreateTemplateCommand);
  } else {
    vscode.window.createTerminal("ctf").sendText("ctf i");
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "ctf-vscode" is now active!');

  const whenClickingOnFolderCommand = vscode.commands.registerCommand(
    "ctf-vscode.createTemplateInFolder",
    (uri: vscode.Uri) => {
      activateCtf(uri.fsPath);
    }
  );

  const whenClickingOnFileCommand = vscode.commands.registerCommand(
    "ctf-vscode.createTemplateInFile",
    (uri: vscode.Uri) => {
      let directoryPath = uri.fsPath.split("/");
      directoryPath.pop();
      (directoryPath as any) = directoryPath.join("/");
      activateCtf(directoryPath as any);
    }
  );

  context.subscriptions.push(
    whenClickingOnFolderCommand,
    whenClickingOnFileCommand
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
