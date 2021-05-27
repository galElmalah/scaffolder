import { chooseTemplate } from './questions';

export const getChosenTemplate = async (availableTemplateCommands, preSelectedTemplate) => {
	if (availableTemplateCommands[preSelectedTemplate]) {
		return {
			chosenTemplateName: preSelectedTemplate
		};
	}
	return chooseTemplate(availableTemplateCommands);
};
