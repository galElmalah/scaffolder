const chalk = require('chalk');

const handleError = err => {
  if (err.getDisplayErrorMessage) {
    console.log(err.getDisplayErrorMessage());
  } else {
    console.error(err);
  }
};

const generateKeyValues = cmd =>
  cmd.parent.rawArgs
    .slice(4)
    .filter(keyValuePair => keyValuePair.includes('='))
    .map(keyValuePair => keyValuePair.split('='))
    .reduce(
      (accm, [key, value]) => ({
        ...accm,
        [key.trim()]: value.trim(),
      }),
      {}
    );

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

module.exports = {
  generateKeyValues,
  showSuccessMessage,
  handleError,
};
