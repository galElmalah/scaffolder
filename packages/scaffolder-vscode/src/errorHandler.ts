import { scaffolderMessage } from "./scaffolderMessage";
import * as vscode from "vscode";

const genericErrorMessage = `Failed to generate your template.\ncheck the output console for more information`;

export const errorHandler = (
  e: Error & { getDisplayErrorMessage?: () => string },
  scaffolderOut: any
) => {
  scaffolderOut.appendLine(e);
  if (e.getDisplayErrorMessage) {
    scaffolderOut.appendLine(e.getDisplayErrorMessage());
    vscode.window.showErrorMessage(
      scaffolderMessage(e.getDisplayErrorMessage())
    );
  } else {
    scaffolderOut.appendLine(e.message);
    vscode.window.showErrorMessage(scaffolderMessage(genericErrorMessage));
  }
};
