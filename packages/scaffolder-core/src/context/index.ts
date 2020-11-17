import { Dictionary } from '../configHelpers/config';
import { TYPES } from '../filesUtils';

export interface Logger  {
  info(message: string):void
  warning(message: string):void
  error(message: string):void
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


export const contextFactory = (base:GlobalCtx) => (overrides: Partial<GlobalCtx> = {}) => ({...base,...overrides});