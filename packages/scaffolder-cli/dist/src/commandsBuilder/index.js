const fs = require('fs');
const path = require('path');
const { NoScaffolderFolder } = require('../../Errors');
const { isFolder } = require('../filesUtils');
const TEMPLATE_FOLDER_NAME = 'scaffolder';
const SEARCH_DEPTH_LIMIT = 25;
const templatePathsFinder = (currentPath) => {
    const pathsQueue = [];
    const pathRoot = path.parse(currentPath).root;
    const isEndOfPath = (_path) => _path === pathRoot || _path === '/' || _path === '' || _path === './';
    const shouldStopSearching = (_path, depth) => isEndOfPath(_path) || depth === SEARCH_DEPTH_LIMIT;
    const findTemplate = (currentPath, depth = 0) => {
        if (isEndOfPath(currentPath) && pathsQueue.length === 0) {
            throw new NoScaffolderFolder();
        }
        if (shouldStopSearching(currentPath, depth)) {
            return pathsQueue;
        }
        const currentDir = fs.readdirSync(currentPath);
        const isScaffolderFolderInThisLevel = currentDir.find((f) => f === TEMPLATE_FOLDER_NAME);
        if (isScaffolderFolderInThisLevel &&
            isFolder(currentPath, TEMPLATE_FOLDER_NAME)) {
            pathsQueue.push(path.join(currentPath, TEMPLATE_FOLDER_NAME));
        }
        return findTemplate(path.join(currentPath, '../'), depth + 1);
    };
    return findTemplate(currentPath);
};
const readTemplatesFromPaths = (paths) => {
    let allCommands = {};
    for (const scaffolderPath of paths) {
        const commands = fs.readdirSync(scaffolderPath);
        if (!commands) {
            continue;
        }
        const commandsToPath = commands
            .filter((p) => p && p[0] !== '.')
            .filter((p) => isFolder(scaffolderPath, p))
            .reduce((accm, cmd) => (Object.assign(Object.assign({}, accm), { [cmd]: path.join(scaffolderPath, cmd) })), {});
        allCommands = Object.assign(Object.assign({}, commandsToPath), allCommands);
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
    readTemplatesFromPaths,
    SEARCH_DEPTH_LIMIT
};
//# sourceMappingURL=index.js.map