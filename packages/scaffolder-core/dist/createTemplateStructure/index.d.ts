export function defaultConfig(): {
    transformers: {};
    functions: {};
    parametersOptions: {};
    templatesOptions: {};
};
export function extractKey(k: any): any;
export function isAFunctionKey(key: any): boolean;
export function getKeyAndTransformers(initialKey: any): any;
export function replaceKeyWithValue(keyValuePairs: any, transformersMap: any, functionsMap: any, ctx: any): (match: any) => any;
export function createTemplateStructure(folderPath: any): any;
export function getConfigPath(path: any): string;
export function templateReader(commands: any): (cmd: any) => {
    config: {
        transformers: {};
        functions: {};
        parametersOptions: {};
        templatesOptions: {};
    };
    currentCommandTemplate: any;
};
export function templateTransformer(templateDescriptor: any, injector: any, globalCtx: any): any;
export function injector(keyValuePairs: any, { transformers, functions }: {
    transformers?: {};
    functions?: {};
}, globalCtx: any): (text: any, localCtx: any) => any;
