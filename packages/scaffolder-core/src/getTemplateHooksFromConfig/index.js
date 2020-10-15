import {TemplateHooksMustBeFunctions} from '../Errors';

const assertHooksAreOfTypeFunction = (hooks, templateName) => {
	Object.entries(hooks).forEach(([hookName,hook] )=> {
		if(!(hook instanceof Function)) {
			throw new TemplateHooksMustBeFunctions({
				hookName,
				hookType: typeof hook,
				templateName
			});
		}
	});
};

export const getTemplateHooksFromConfig = (config, templateName) => {
	if(!config.templatesOptions[templateName]) {
		return {};
	}
	const templateHooks = config.templatesOptions[templateName].hooks;
  
	if(templateHooks) {
		assertHooksAreOfTypeFunction(templateHooks,templateName);
		return templateHooks;
	}
  
	return  {};

};

