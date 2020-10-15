"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplateHooksFromConfig = void 0;
var Errors_1 = require("../Errors");
var assertHooksAreOfTypeFunction = function (hooks, templateName) {
    Object.entries(hooks).forEach(function (_a) {
        var hookName = _a[0], hook = _a[1];
        if (!(hook instanceof Function)) {
            throw new Errors_1.TemplateHooksMustBeFunctions({
                hookName: hookName,
                hookType: typeof hook,
                templateName: templateName
            });
        }
    });
};
exports.getTemplateHooksFromConfig = function (config, templateName) {
    if (!config.templatesOptions[templateName]) {
        return {};
    }
    var templateHooks = config.templatesOptions[templateName].hooks;
    if (templateHooks) {
        assertHooksAreOfTypeFunction(templateHooks, templateName);
        return templateHooks;
    }
    return {};
};
//# sourceMappingURL=index.js.map