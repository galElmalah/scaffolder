#!/usr/bin/env node
const cli = require('commander');
const { createCommandHandler, listCommandHandler, showCommandHandler } = require('./src/cliCommandHandlers')
cli
  .command('create <commandName>')
  .option(
    '-f, --folder [value]',
    'Folder name that the template will be generated into'
  )
  .option(
    '--entry-point [value]',
    'The entry point to be used instead of the current working directory'
  )
  .alias('c')
  .description('Create template folder structure')
  .action(createCommandHandler);

cli
  .command('list')
  .alias('ls')
  .description('Show all available commands and their paths')
  .action(listCommandHandler);

cli
  .command('show <commandName>')
  .alias('s')
  .description('Show specific command corresponding template files')
  .option('-w, --showContent')
  .action(showCommandHandler);

cli.parse(process.argv);
