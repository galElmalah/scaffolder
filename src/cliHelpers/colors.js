const chalk = require('chalk');
module.exports.error = chalk.bold.red;
module.exports.boldGreen = chalk.green.bold;
module.exports.path = chalk.blue.underline.bold;
module.exports.bold = chalk.bold;

module.exports.multiColors = word => {
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
