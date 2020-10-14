export = TemplateHooksMustBeFunctions;
declare class TemplateHooksMustBeFunctions extends TypeError {
    constructor({ hookName, templateName, hookType }: {
        hookName: any;
        templateName: any;
        hookType: any;
    });
    hookName: any;
    templateName: any;
    hookType: any;
    getDisplayErrorMessage(): string;
}
