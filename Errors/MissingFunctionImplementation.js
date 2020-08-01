const { error, boldGreen, path } = require('../src/cliHelpers/colors');
class MissingFunctionImplementation extends Error {
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
		)}" function in your scaffolder.config.js file\nFor more information about transformers check this out ${path(
			'https://github.com/galElmalah/scaffolder#getting-started'
		)}`;

		return message;
	}

	get name() {
		return 'MissingFunctionImplementation';
	}
}

module.exports = MissingFunctionImplementation;
