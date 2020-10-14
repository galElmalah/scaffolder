var chalk = require('chalk');
module.exports.error = chalk.bold.red;
module.exports.boldGreen = chalk.green.bold;
module.exports.path = chalk.blue.underline.bold;
module.exports.bold = chalk.bold;
module.exports.multiColors = function (word) {
    var colors = [
        chalk.greenBright,
        chalk.yellowBright,
        chalk.redBright,
        chalk.magentaBright,
        chalk.cyanBright,
    ];
    var colorful = word
        .split('')
        .reduce(function (accm, char, i) { return accm + colors[i % 5](char); }, '');
    return colorful;
};
//# sourceMappingURL=colors.js.map