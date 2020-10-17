import { scaffolderMessage } from "./scaffolderMessage";
import * as vscode from "vscode";

const genericErrorMessage = `Failed to generate your template.\ncheck the output console for more information`;

export const errorHandler = (
  e: Error & { getDisplayErrorMessage?: () => string },
  log: (message: any) => void
) => {
  log(e);
  if (e.getDisplayErrorMessage) {
    log(e.getDisplayErrorMessage());
    vscode.window.showErrorMessage(
      scaffolderMessage(e.getDisplayErrorMessage())
    );
  } else {
    log(e.message);
    vscode.window.showErrorMessage(scaffolderMessage(genericErrorMessage));
  }
};
