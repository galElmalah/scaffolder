const chalk = require('chalk');
const { bold, boldGreen, path, multiColors } = require('./colors');

export const handleError = (err) => {
	if (err.getDisplayErrorMessage) {
		console.log(err.getDisplayErrorMessage());
	} else {
		console.error(err);
	}
};


export const generateKeyValues = (cmd) =>
	cmd.parent.rawArgs
		.filter((arg) => arg.includes('='))
		.map((keyValuePair) => keyValuePair.split('='))
		.reduce(
			(accm, [key, value]) => ({
				...accm,
				[key.trim()]: value.trim(),
			}),
			{}
		);

export const showSuccessMessage = (command, createdAtPath) => {
	const message = `${multiColors(
		'Hooray!!'
	)}\nSuccessfuly created the ${boldGreen(command)} template at ${path(
		createdAtPath
	)}
    `;
	console.log(message);
};

export const getLongestCommand = (commands) => {
	return Math.max(
		...Object.keys(commands)
			.filter((c) => c[0] !== '.')
			.map((c) => c.length)
	);
};

export const displayAvailableCommands = (commands) => {
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

export const boxFileName = (name) => {
	console.log(bold(''.padEnd(name.length + 4, '-')));
	console.log(`| ${boldGreen(name)} |`);
	console.log(bold(''.padEnd(name.length + 4, '-')));
};

export const displaySpecificCommandTemplate = (templates, shouldShowContent) => {
	templates.forEach(({ name, content }) => {
		boxFileName(`${name}`);

		if (shouldShowContent) {
			console.log((content || bold('EMPTY FILE')) + '\n');
		}
	});
};

