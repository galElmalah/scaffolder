const chalk = require('chalk');

const generateKeyValues = cmd =>
  cmd.parent.rawArgs
    .slice(4)
    .map(keyValuePair => keyValuePair.split('='))
    .reduce((accm, [key, value]) => ({ ...accm, [key]: value }), {});

const error = chalk.bold.red;
const boldGreen = chalk.green.bold;
const path = chalk.blue.underline.bold;
const multiColor = word => {
  const colors = [
    chalk.greenBright,
    chalk.yellowBright,
    chalk.redBright,
    chalk.magentaBright,
    chalk.cyanBright,
  ];
  const colorful = word
    .split('')
    .reduce((accm, char, i) => accm + colors[i % 5](char), '');

  return colorful;
};

const showSuccessMessage = (command, createdAtPath) => {
  const message = `${multiColor(
    'Hooray!!'
  )}\nSuccessfuly created the ${boldGreen(command)} template at ${path(
    createdAtPath
  )}
    `;
  console.log(message);
};

const showErrorMessage = (command, folder, createdAtPath) => {
  const message = `${error(
    `Error while creating the ${boldGreen(command)} template.`
  )}\nthere is probably a folder with the same name as ${boldGreen(
    folder
  )}\nat the location ${path(createdAtPath)}
      `;
  console.log(message);
};

module.exports = { generateKeyValues, showSuccessMessage, showErrorMessage };
