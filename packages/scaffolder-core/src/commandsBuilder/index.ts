import fs from 'fs';
import path from 'path';
import { isFolder } from '../filesUtils';

export const TEMPLATE_FOLDER_NAME = 'scaffolder';

export const SEARCH_DEPTH_LIMIT = 25;

export const enum CommandType {
  REMOTE = 'remote',
  LOCAL = 'local',
}

export interface CommandEntry {
  type: CommandType;
  location: string;
  description?: string;
  name?: string;
}

export type Commands = Record<string, CommandEntry>;

export const templatePathsFinder = (currentPath: string): string[] => {
	const pathsQueue: string[] = [];
	const pathRoot = path.parse(currentPath).root;
	const isEndOfPath = (_path: string) =>
		_path === pathRoot || _path === '/' || _path === '' || _path === './';
	const shouldStopSearching = (_path: string, depth: number) =>
		isEndOfPath(_path) || depth === SEARCH_DEPTH_LIMIT;

	const findTemplate = (currentPath: string, depth = 0) => {
		if (shouldStopSearching(currentPath, depth)) {
			return pathsQueue;
		}

		const currentDir = fs.readdirSync(currentPath);

		const isScaffolderFolderInThisLevel = currentDir.some(
			(f) => f === TEMPLATE_FOLDER_NAME
		);

		if (
			isScaffolderFolderInThisLevel &&
      isFolder(currentPath, TEMPLATE_FOLDER_NAME)
		) {
			pathsQueue.push(path.join(currentPath, TEMPLATE_FOLDER_NAME));
		}

		return findTemplate(path.join(currentPath, '../'), depth + 1);
	};
	return findTemplate(currentPath);
};

export const readTemplatesFromPaths = (paths: string[]): Commands => {
	let allCommands = {};
	for (const scaffolderPath of paths) {
		const commands = fs.readdirSync(scaffolderPath);
		if (!commands) {
			continue;
		}

		const commandsToPath = commands
			.filter((p) => p && p[0] !== '.')
			.filter(isFolder(scaffolderPath))
			.reduce(
				(accm, cmd) => ({
					...accm,
					[cmd]: {
						location: path.join(scaffolderPath, cmd),
						type: CommandType.LOCAL,
						name: cmd,
					},
				}),
				{}
			);

		allCommands = {
			...commandsToPath,
			...allCommands,
		};
	}

	return allCommands;
};

/**
 * @param {string} currentPath Initial path to start searching from for scaffolder folders.
 */
export const commandsBuilder = (currentPath: string) => {
	const scaffolderPaths = templatePathsFinder(currentPath);
	return readTemplatesFromPaths(scaffolderPaths);
};
