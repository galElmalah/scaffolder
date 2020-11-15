const { error, boldGreen } = require('../cliHelpers/colors');

export class NoMatchingTemplate extends Error {
	private templateName: string
	constructor(templateName) {
		super();
		this.templateName = templateName;
	}

	getDisplayErrorMessage() {
		const message = `${error(
			`Error while creating the ${boldGreen(this.templateName)} template.`
		)}\nThere is no template matching the ${boldGreen(
			this.templateName
		)} command.\nYou can see the available commands by typing ${boldGreen(
			'scaffolder list'
		)} in the terminal.`;
		return message;
	}

	get name() {
		return 'NoMatchingTemplate';
	}
}

