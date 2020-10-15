import * as scaffolder from "scaffolder-core";
import * as vscode from "vscode";

const toQuickPickWithDetails = (availableTemplateCommands: any) => (
  template: string
) => ({
  label: template,
  detail: `Template path: ${availableTemplateCommands[template]}`,
});

export const chooseTemplate = async (availableTemplateCommands: any) => {
  const chosenTemplate = await vscode.window.showQuickPick(
    Object.keys(availableTemplateCommands).map(
      toQuickPickWithDetails(availableTemplateCommands)
    ),
    {
      placeHolder: "Choose a template",
      ignoreFocusOut: true,
    }
  );

  return chosenTemplate ? chosenTemplate.label : "";
};
