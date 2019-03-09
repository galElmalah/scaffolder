const chalk = require('chalk');
const error = chalk.bold.red;
const boldGreen = chalk.green.bold;
const path = chalk.blue.underline.bold;

class NoMatchingTemplate extends Error {
  constructor(cmd) {
    super(`There is no template matching the ${cmd} command`);
    this.cmd = cmd;
  }

  getDisplayErrorMessage() {
    const message = `${error(
      `Error while creating the ${boldGreen(this.cmd)} template.`
    )}\nThere is no template matching the ${boldGreen(this.cmd)} command`;
    return message;
  }

  get name() {
    return 'NoMatchingTemplate';
  }
}

module.exports = NoMatchingTemplate;
