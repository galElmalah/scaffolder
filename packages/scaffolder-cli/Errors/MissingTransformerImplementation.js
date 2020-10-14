const { error, boldGreen, path } = require('../src/cliHelpers/colors');
class MissingTransformerImplementation extends Error {
	constructor({ transformationKey }) {
		super();
		this.transformationKey = transformationKey;
	}

	getDisplayErrorMessage() {
		const message = `${error(
			`Error while trying to apply the following transformation "${boldGreen(
				this.transformationKey
			)}".`
		)}\nYou are probably missing a definition for the "${boldGreen(
			this.transformationKey
		)}" transformer in your scaffolder.config.js file\nFor more information about transformers check this out ${path(
			'https://github.com/galElmalah/scaffolder#getting-started'
		)}`;

		return message;
	}

	get name() {
		return 'MissingTransformerImplementation';
	}
}

module.exports = MissingTransformerImplementation;
