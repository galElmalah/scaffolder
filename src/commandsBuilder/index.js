const fs = require("fs");
const path = require("path");
const { NoScaffolderFolder } = require("../../Errors");
const { isFolder } = require("../filesUtils");

const TEMPLATE_FOLDER_NAME = "scaffolder";

const endOfPath = (path) => path === "/" || path === "" || path === "./";

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

    return findTemplate(path.join(currentPath, "../"));
  };
  return findTemplate(currentPath);
};

const commandsBuilder = (currentPath) => {
  const scaffolderPaths = templatePathsFinder(currentPath);
  let allCommands = {};
  for (const scaffolderPath of scaffolderPaths) {
    const commands = fs.readdirSync(scaffolderPath);

    let commandsToPath = commands
      .filter((p) => p[0] !== ".")
      .reduce(
        (accm, cmd) => ({ ...accm, [cmd]: path.join(scaffolderPath, cmd) }),
        {}
      );
    allCommands = { ...commandsToPath, ...allCommands };
  }
  return allCommands;
};

module.exports = { commandsBuilder, templatePathsFinder };
