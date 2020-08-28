const fs = require('fs');
const path = require('path');
const { NoScaffolderFolder } = require('../../Errors');
const { isFolder } = require('../filesUtils');

const TEMPLATE_FOLDER_NAME = 'scaffolder';

const endOfPath = (path) => path === '/' || path === '' || path === './';

const templatePathsFinder = (currentPath) => {
	const pathsQueue = [];
	const findTemplate = (currentPath) => {
		if (endOfPath(currentPath) && pathsQueue.length === 0) {
			throw new NoScaffolderFolder();
		}
		if (endOfPath(currentPath)) {
			return pathsQueue;
		}
		const currentDir = fs.readdirSync(currentPath);

		const isScaffolderFolderInThisLevel = currentDir.find(
			(f) => f === TEMPLATE_FOLDER_NAME
		);

		if (
			isScaffolderFolderInThisLevel &&
      isFolder(currentPath, TEMPLATE_FOLDER_NAME)
		) {
			pathsQueue.push(path.join(currentPath, TEMPLATE_FOLDER_NAME));
		}

		return findTemplate(path.join(currentPath, '../'));
	};
	return findTemplate(currentPath);
};

const readTemplatesFromPaths = (paths) => {
	let allCommands = {};
	for (const scaffolderPath of paths) {
		const commands = fs.readdirSync(scaffolderPath);

		const commandsToPath = commands
			.filter((p) => p[0] !== '.')
			.filter((p) => isFolder(scaffolderPath, p))
			.reduce(
				(accm, cmd) => ({
					...accm, [cmd]: path.join(scaffolderPath, cmd) 
				}),
				{}
			);
		allCommands = {
			...commandsToPath, ...allCommands 
		};
	}
	return allCommands;
};
/**
 *
 * @param {string} currentPath Used as the root entry from which we start looking for scaffolder directories
 * @returns {Object.<string, string>} key value pairs where the key is the template command and the value is the path to that command
 */
const commandsBuilder = (currentPath) => {
	const scaffolderPaths = templatePathsFinder(currentPath);
	return readTemplatesFromPaths(scaffolderPaths);
};

module.exports = {
	commandsBuilder, 
	templatePathsFinder,
	readTemplatesFromPaths
};
