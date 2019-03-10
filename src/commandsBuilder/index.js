const fs = require('fs');
const path = require('path');
const { NoCtfFolder } = require('../../Errors');
const isFolder = basePath => filePath =>
  fs.lstatSync(path.resolve(basePath, filePath)).isDirectory();

const TEMPLATE_FOLDER_NAME = 'ctf';

const endOfPath = path => path === '/' || path === '' || path === './';

const templatePathsFinder = currentPath => {
  const pathsQueue = [];
  const findTemplate = currentPath => {
    if (endOfPath(currentPath) && pathsQueue.length === 0) {
      throw new NoCtfFolder();
    }
    if (endOfPath(currentPath)) {
      return pathsQueue;
    }
    const currentDir = fs.readdirSync(currentPath);

    const isCtfFolderInThisLevel = currentDir.find(
      f => f === TEMPLATE_FOLDER_NAME
    );

    if (isCtfFolderInThisLevel && isFolder(currentPath)(TEMPLATE_FOLDER_NAME)) {
      pathsQueue.push(path.join(currentPath, TEMPLATE_FOLDER_NAME));
    }

    return findTemplate(path.join(currentPath, '../'));
  };
  return findTemplate(currentPath);
};

const commandsBuilder = currentPath => {
  const ctfPaths = templatePathsFinder(currentPath);
  let allCommands = {};
  for (const ctfPath of ctfPaths) {
    const commands = fs.readdirSync(ctfPath);
    let commandsToPath = commands.reduce(
      (accm, cmd) => ({ ...accm, [cmd]: path.join(ctfPath, cmd) }),
      {}
    );
    allCommands = { ...commandsToPath, ...allCommands };
  }
  return allCommands;
};

module.exports = { commandsBuilder, templatePathsFinder };
