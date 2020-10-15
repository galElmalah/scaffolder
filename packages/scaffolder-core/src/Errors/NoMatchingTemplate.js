const { error, boldGreen } = require('../cliHelpers/colors');

export class NoMatchingTemplate extends Error {
	constructor(cmd) {
		super();
		this.cmd = cmd;
	}

	getDisplayErrorMessage() {
		const message = `${error(
			`Error while creating the ${boldGreen(this.cmd)} template.`
		)}\nThere is no template matching the ${boldGreen(
			this.cmd
		)} command.\nYou can see the available commands by typing ${boldGreen(
			'scaffolder list'
		)} in the terminal.`;
		return message;
	}

	get name() {
		return 'NoMatchingTemplate';
	}
}

