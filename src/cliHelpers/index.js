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
    .filter(arg => arg.includes('='))
    .map(keyValuePair => keyValuePair.split('='))
    .reduce(
      (accm, [key, value]) => ({
        ...accm,
        [key.trim()]: value.trim(),
      }),
      {}
    );

const boldGreen = chalk.green.bold;
const bold = chalk.bold;
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

const getLongestCommand = commands => {
  return Math.max(
    ...Object.keys(commands)
      .filter(c => c[0] !== '.')
      .map(c => c.length)
  );
};

const displayAvailableCommands = commands => {
  const longestCommandLength = getLongestCommand(commands);
  console.log(
    chalk.bold(`${'Command'.padEnd(longestCommandLength, ' ')} | Location`)
  );

  Object.entries(commands)
    .filter(([command]) => command[0] !== '.')
    .forEach(([command, location]) => {
      console.log(
        `${boldGreen(command.padEnd(longestCommandLength + 1, ' '))}| ${path(
          location
        )}`
      );
    });
};

const boxFileName = name => {
  console.log(bold(''.padEnd(name.length + 4, '-')));
  console.log(`| ${boldGreen(name)} |`);
  console.log(bold(''.padEnd(name.length + 4, '-')));
};

const displaySpecifcCommandTemplate = (templates, shouldShowContent) => {
  templates.forEach(({ name, content }) => {
    boxFileName(name);
    if (shouldShowContent) {
      console.log((content || bold('EMPTY FILE')) + '\n');
    }
  });
};

module.exports = {
  generateKeyValues,
  showSuccessMessage,
  handleError,
  displayAvailableCommands,
  displaySpecifcCommandTemplate,
};
