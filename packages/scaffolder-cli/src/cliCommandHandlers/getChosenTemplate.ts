import { chooseTemplate } from './questions';

export const getChosenTemplate = async (availableTemplateCommands, preSelectedTemplate) => {
	if (availableTemplateCommands[preSelectedTemplate]) {
		return {
			chosenTemplate: preSelectedTemplate
		};
	}
	return chooseTemplate(availableTemplateCommands);
};
