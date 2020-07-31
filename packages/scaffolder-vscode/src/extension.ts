// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as scaffolder from "scaffolder-cli";

//Create output channel
let scaffolderOut = vscode.window.createOutputChannel("Scaffolder");
scaffolderOut.appendLine("alshdkjaslhdkjash");
function executeTerminalCommand(command: string) {
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
  executeTerminalCommand(ctfCreateTemplateCommand);
}

const getDefaultQuestion = (key: string) =>
  `Enter a value for the following key "${key}"`;

const getQuestion = (paramsOptions: { [k: string]: any }, key: string) => {
  return (
    (paramsOptions[key] && paramsOptions[key].question) ||
    getDefaultQuestion(key)
  );
};

export function activate(context: vscode.ExtensionContext) {
  const whenClickingOnFolderCommand = vscode.commands.registerCommand(
    "scaffolder-vscode.createTemplateInFolder",
    async (uri: vscode.Uri) => {
      try {
        const availableTemplateCommands = await scaffolder.commandsBuilder(
          uri.fsPath
        );
        const { label: chosenTemplate } =
          (await vscode.window.showQuickPick(
            Object.keys(availableTemplateCommands).map((template) => ({
              label: template,
              detail: `Template path: ${availableTemplateCommands[template]}`,
            })),
            {
              placeHolder: "Choose a template",
              ignoreFocusOut: true,
            }
          )) || {};

        if (!chosenTemplate) {
          return;
        }

        scaffolderOut.appendLine(JSON.stringify({ chosenTemplate }, null, 2));
        const { config, currentCommandTemplate } = scaffolder.templateReader(
          availableTemplateCommands
        )(chosenTemplate);

        const templateKeys = scaffolder.extractAllKeysFromTemplate(
          currentCommandTemplate
        );

        scaffolderOut.appendLine(
          JSON.stringify({ chosenTemplate, config, templateKeys }, null, 2)
        );

        const paramsValues = {};

        for (let param of templateKeys) {
          const cleanKey = scaffolder.extractKey(param);
          const paramValue = await vscode.window.showInputBox({
            prompt: getQuestion(config.parametersOptions, cleanKey),
            placeHolder: `Enter value (${templateKeys.indexOf(param) + 1}/${
              templateKeys.length
            })`,
          });
          // @ts-ignore
          paramsValues[scaffolder.extractKey(param)] = paramValue;
        }

        const globalCtx = {
          parametersValues: paramsValues,
          templateName: chosenTemplate,
          templateRoot: availableTemplateCommands[chosenTemplate],
          targetRoot: uri.fsPath,
        };

        const templates = scaffolder.templateTransformer(
          currentCommandTemplate,
          scaffolder.injector(paramsValues, config, globalCtx),
          globalCtx
        );

        const templatesBuilder = new scaffolder.TemplatesBuilder(
          templates,
          chosenTemplate
        );
        templatesBuilder.withCustomEntryPoint(uri.fsPath);
        await Promise.all(templatesBuilder.build());
        vscode.window.showInformationMessage(
          `Scaffolder: Generated "${chosenTemplate}" at - ${uri.fsPath}`
        );
      } catch (e) {
        scaffolderOut.appendLine(e);
        vscode.window.showInformationMessage(
          `Scaffolder: Failed to generate your template - check the output console for more information`
        );
      }

      // const values = await scaffolder.commandsBuilder(uri.fsPath);

      // activateScaffolder(uri.fsPath);
    }
  );

  const whenClickingOnFileCommand = vscode.commands.registerCommand(
    "scaffolder-vscode.createTemplateInFile",
    (uri: vscode.Uri) => {
      let directoryPath = uri.fsPath.split("/");
      directoryPath.pop();
      (directoryPath as any) = directoryPath.join("/");

      // scaffolder.commandsBuilder(directoryPath).then((r) => {
      //   scaffolderOut.appendLine(JSON.stringify(r));
      //   scaffolderOut.appendLine("JSON.stringify(r)");
      // });

      activateScaffolder(directoryPath as any);
    }
  );

  const listTemplates = vscode.commands.registerCommand(
    "scaffolder-vscode.listTemplates",
    (uri: vscode.Uri) => {
      executeTerminalCommand(`scaff ls --entry-point ${uri.fsPath}`);
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
