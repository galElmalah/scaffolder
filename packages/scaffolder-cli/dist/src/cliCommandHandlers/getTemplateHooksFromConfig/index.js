const TemplateHooksMustBeFunctions = require('../../../Errors/TemplateHooksMustBeFunctions');
const assertHooksAreOfTypeFunction = (hooks, templateName) => {
    Object.entries(hooks).forEach(([hookName, hook]) => {
        if (!(hook instanceof Function)) {
            throw new TemplateHooksMustBeFunctions({
                hookName,
                hookType: typeof hook,
                templateName
            });
        }
    });
};
const getTemplateHooksFromConfig = (config, templateName) => {
    if (!config.templatesOptions[templateName]) {
        return {};
    }
    const templateHooks = config.templatesOptions[templateName].hooks;
    if (templateHooks) {
        assertHooksAreOfTypeFunction(templateHooks, templateName);
        return templateHooks;
    }
    return {};
};
module.exports = {
    getTemplateHooksFromConfig
};
//# sourceMappingURL=index.js.map