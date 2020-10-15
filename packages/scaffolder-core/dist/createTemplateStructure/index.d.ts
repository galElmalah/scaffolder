export declare const defaultConfig: () => {
    transformers: {};
    functions: {};
    parametersOptions: {};
    templatesOptions: {};
};
export declare const extractKey: (k: any) => any;
export declare const isAFunctionKey: (key: string) => boolean;
export declare const getKeyAndTransformers: (initialKey: any) => any;
export declare const replaceKeyWithValue: (keyValuePairs: any, transformersMap: any, functionsMap: any, ctx: any) => (match: any) => any;
export declare const createTemplateStructure: (folderPath: any) => any;
export declare const getConfigPath: (path: any) => string;
export declare const templateReader: (commands: any) => (cmd: any) => {
    config: {
        transformers: {};
        functions: {};
        parametersOptions: {};
        templatesOptions: {};
    };
    currentCommandTemplate: any;
};
export declare const templateTransformer: (templateDescriptor: any, injector: any, globalCtx: any) => any;
export declare const keyPatternString = "{{s*[a-zA-Z_|0-9- ()]+s*}}";
export declare const injector: (keyValuePairs: any, { transformers, functions }: {
    transformers?: {};
    functions?: {};
}, globalCtx: any) => (text: any, localCtx: any) => any;
