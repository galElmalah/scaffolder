import { TYPES } from '../filesUtils';

export interface Logger  {
  info(message: string):void
  warning(message: string):void
  error(message: string):void
}

export interface Dictionary<T> {
  [key: string]: T;
}

export interface GlobalCtx {
  parametersValues: Dictionary<any>;
  templateName: string;
  templateRoot: string;
  targetRoot: string;
  logger: Logger;
}

export interface LocalCtx {
  currentFilePath: string;
  fileName: string;
  type: TYPES;
}

export type Context = Readonly<LocalCtx & GlobalCtx>;

export type ScaffolderTransformer = (parameterValue: any, context: Context) => any;
export type ScaffolderFunction = (context: Context) => any;

export interface ParameterOptions {
  question?: string;
  validation?: (parameterValue:any) => string | boolean;
}

export interface Hooks {
  preTemplateGeneration?: (context: Context) => any | Promise<any>;
  postTemplateGeneration?: (context: Context) => any | Promise<any>;
}

// this interface should extend a common options interface with transformers. function and parameters options
export interface TemplateOptions {
  hooks?: Hooks
}

export interface CommonConfig {
  transformers: Dictionary<ScaffolderTransformer>;
  functions: Dictionary<ScaffolderFunction>;
  parametersOptions: Dictionary<Dictionary<ParameterOptions>>;
}


export interface Config extends CommonConfig {
  templatesOptions: Dictionary<Dictionary<TemplateOptions>>;
}
