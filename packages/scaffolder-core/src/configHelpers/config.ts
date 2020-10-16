import { TYPES } from '../filesUtils';


export interface Dictionary<T> {
  [key: string]: T;
}

export interface Context {
  parametersValues: Dictionary<any>;
  templateName: string;
  templateRoot:string;
  targetRoot: string;
  currentFilePath: string;
  fileName: string;
  type: TYPES;
}

export type ScaffolderTransformer = (parameterValue: any, context: Context) => any;
export type ScaffolderFunction = (context: Context) => any;

export interface ParameterOptions {
  question?: string;
  validation?: string | boolean;
}

export interface Hooks {
  preTemplateGeneration: (context: Context) => any | Promise<any>;
  postTemplateGeneration: (context: Context) => any | Promise<any>;
}

// this interface should extend a common options interface with transformers. function and parameters options
export interface TemplateOptions {
  hooks?: Hooks
}


export interface Config {
  transformers: Dictionary<ScaffolderTransformer>;
  functions: Dictionary<ScaffolderFunction>;
  parametersOptions: Dictionary<Dictionary<ParameterOptions>>;
  templatesOptions: Dictionary<Dictionary<TemplateOptions>>;
}
