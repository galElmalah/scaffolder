const fs = require('fs');
const path = require('path');

const commandsBuilder = require('./commandsBuilder');

const templateReader = (commands, injector) => cmd => {
  const files = fs.readdirSync(commands[cmd]);
  console.log(files);
  injector('{{abc}}');
};

const injector = keyValuePairs => text => {
  const matches = text.match(/{{\w+}}/);
  console.log(keyValuePairs, text, matches);
};

templateReader(
  commandsBuilder(process.cwd()),
  injector({ key: 'value', bc: 'hoo yeah' })
)('a');
