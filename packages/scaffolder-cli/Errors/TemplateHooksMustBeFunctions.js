const { error, boldGreen, bold } = require('../src/cliHelpers/colors');
class TemplateHooksMustBeFunctions extends TypeError {
	constructor({ hookName, templateName, hookType }) {
		super();
		this.hookName = hookName;
		this.templateName = templateName;
		this.hookType = hookType;
	}

	getDisplayErrorMessage() {
		const message = `${error(
			`Error while calling the ${boldGreen(`"${this.hookName}"`)} from ${boldGreen(`"${this.templateName}"`)} template.`
		)}\nHooks must be of type ${bold('"Function"')} while your hook is of type ${bold(`"${this.hookType}"`)}.
          `;

		return message;
	}

	get name() {
		return 'TemplateHooksMustBeFunctions';
	}
}

module.exports = TemplateHooksMustBeFunctions;
