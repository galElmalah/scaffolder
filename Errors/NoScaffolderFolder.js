const { error, path } = require("../src/cliHelpers/colors");

class NoScaffolderFolder extends Error {
  constructor() {
    super();
  }

  getDisplayErrorMessage() {
    const githubLink = "https://github.com/galElmalah/scaffolder";
    const message = `${error(
      "Error there is no scaffolder folder."
    )}\nPlease create a scaffolder folder.\nFor more info checkout: ${path(
      githubLink
    )}`;

    return message;
  }

  get name() {
    return "NoScaffolderFolder";
  }
}

module.exports = NoScaffolderFolder;
