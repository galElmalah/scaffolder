// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

function execuateTerminalCommand(command: string) {
  if (vscode.window.activeTerminal?.name === "scaffolder") {
    vscode.window.activeTerminal.sendText(command);
    return;
  }
  const terminal = vscode.window.createTerminal("scaffolder");
  terminal.show();
  terminal.sendText(command);
}
function activateScaffolder(path: string) {
  const ctfCreateTemplateCommand = `scaff i --entry-point ${path}`;
  execuateTerminalCommand(ctfCreateTemplateCommand);
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

  const listTemplates = vscode.commands.registerCommand(
    "scaffolder-vscode.listTemplates",
    (uri: vscode.Uri) => {
      execuateTerminalCommand(`scaff ls --entry-point ${uri.fsPath}`);
    }
  );

  context.subscriptions.push(
    whenClickingOnFolderCommand,
    whenClickingOnFileCommand,
    listTemplates
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
