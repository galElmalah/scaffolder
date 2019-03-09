const fs = require('fs');
const path = require('path');
const { NoCtfFolder } = require('../../Errors');
const isFolder = basePath => filePath =>
  fs.lstatSync(path.resolve(basePath, filePath)).isDirectory();

const TEMPLATE_FOLDER_NAME = 'ctf';

const templatePathFinder = currentPath => {
  if (currentPath === '/' || currentPath === '' || currentPath === './') {
    throw new NoCtfFolder();
  }
  const currentDir = fs.readdirSync(currentPath);

  const isCtfFolderInThisLevel = currentDir.find(
    f => f === TEMPLATE_FOLDER_NAME
  );

  if (isCtfFolderInThisLevel && isFolder(currentPath)(TEMPLATE_FOLDER_NAME)) {
    return path.join(currentPath, TEMPLATE_FOLDER_NAME);
  }

  return templatePathFinder(path.join(currentPath, '../'));
};

const commandsBuilder = currentPath => {
  const ctfPath = templatePathFinder(currentPath);
  const commands = fs.readdirSync(ctfPath);
  const commandsToPath = commands.reduce(
    (accm, cmd) => ({ ...accm, [cmd]: path.join(ctfPath, cmd) }),
    {}
  );
  return commandsToPath;
};

module.exports = { commandsBuilder, templatePathFinder };
