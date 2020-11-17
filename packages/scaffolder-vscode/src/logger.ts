import * as vscode from "vscode";
import { Logger } from 'scaffolder-core';

const scaffolderOutChannel = vscode.window.createOutputChannel("Scaffolder");

const logFormat = (logLevel: keyof Logger, message:string) => `[${logLevel}][context-logger]::${message}`;

export const makeLogger = ():Logger => {
  return {
    info: (str: any) => scaffolderOutChannel.appendLine(logFormat('info',str)),
    warning: (str: any) => scaffolderOutChannel.appendLine(logFormat('warning',str)),
    error: (str: any) => scaffolderOutChannel.appendLine(logFormat('error',str)),
  };
};

export const logger = {
  log: (str: any) => scaffolderOutChannel.appendLine(str),
};
