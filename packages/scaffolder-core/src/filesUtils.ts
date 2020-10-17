import * as fs from 'fs';
import * as path from 'path';
import { curry } from 'ramda';
export const isFolder = curry((basePath: string, filePath: string): boolean =>
	fs.lstatSync(path.resolve(basePath, filePath)).isDirectory());

export const join = (...args: string[]): string => path.join(...args);

export const enum TYPES {
  FOLDER = 'FOLDER',
  FILE = 'FILE',
  FILE_NAME = 'FILE_NAME',
  FILE_CONTENT = 'FILE_CONTENT',
}
