#!/usr/bin/env node
import cli from 'commander';
import {
	createCommandHandler,
	listCommandHandler,
	showCommandHandler,
	interactiveCreateCommandHandler,
} from './src/cliCommandHandlers';

cli
	.command('create <templateName>')
	.option(
		'-f, --folder <folder>',
		'Folder name that the template will be generated into',
		''
	)
	.option(
		'--path-prefix <relativePath>',
		'Path that will be appended the the location the script is generated into',
		''
	)
	.option(
		'--entry-point <absolutePath>',
		'The entry point to generate the template into (Absolute path)'
	)
	.option(
		'--load-from <absolutePath>',
		'A path to a scaffolder folder from which to load the templates.'
	)
	.alias('c')
	.description('Create template folder structure')
	.action(createCommandHandler);

cli
	.command('interactive')
	.alias('i')
	.option(
		'--path-prefix <relativePath>',
		'Path that will be appended the the location the script is generated into',
		''
	)
	.option(
		'--entry-point <absolutePath>',
		'The entry point to generate the template into (Absolute path)'
	)
	.option(
		'--from-github',
		'Using this option will consume the templates from a specified Github repository.\nExample templates repository can be seen here https://github.com/galElmalah/scaffolder-templates-example'
	)
	.option('--template <templateName>', 
		'Start the interactive mode with a preselected template.'
	)
	.description(
		'Interactive mode that ask for the user input on each step of the way'
	)
	.action(interactiveCreateCommandHandler);

cli
	.command('list')
	.alias('ls')
	.option(
		'--entry-point <absolutePath>',
		'The entry point from which you want to see all available templates (Absolute path)'
	)
	.description('Show all available commands and their paths')
	.action(listCommandHandler);

cli
	.command('show <templateName>')
	.alias('s')
	.description('Show specific command corresponding template files')
	.option('-c, --show-content')
	.action(showCommandHandler);

cli.parse(process.argv);
