const { error, boldGreen, path } = require('../cliHelpers/colors');

export class MissingFunctionImplementation extends Error {
	private functionKey: string;
	constructor({ functionKey }) {
		super();
		this.functionKey = functionKey;
	}

	getDisplayErrorMessage() {
		const message = `${error(
			`Error while trying to apply the following function "${boldGreen(
				this.functionKey
			)}".`
		)}\nYou are probably missing a definition for the "${boldGreen(
			this.functionKey
		)}" function in your scaffolder.config.js file
		\nFor more information about functions check this out ${path(
		'https://github.com/galElmalah/scaffolder#getting-started'
	)}`;

		return message;
	}

	get name() {
		return 'MissingFunctionImplementation';
	}
}

