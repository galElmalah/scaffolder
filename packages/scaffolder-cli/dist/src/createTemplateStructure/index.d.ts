/**
 * Global context
 */
export type GlobalContext = {
    /**
     * Contain the the values for each of the user keys.
     */
    keyValuePairs: {
        [x: string]: string | number;
    };
    /**
     * - The template that being created location.
     */
    templateRoot: string;
    /**
     * - Can  be either "FILE_NAME", "FILE_CONTENT" or "FOLDER".
     */
    type: string;
};
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
/**
 * Global context
 * @typedef {Object} GlobalContext
 * @property {Object.<string, string|number>} keyValuePairs Contain the the values for each of the user keys.
 * @property {string} templateRoot - The template that being created location.
 * @property {string} type - Can  be either "FILE_NAME", "FILE_CONTENT" or "FOLDER".
 */
/**
 * @param {Object.<string, string|number>} keyValuePairs contain the the values for each of the user keys
 * @param {Object.<string, any>} config
 * @param {GlobalContext} globalCtx

 */
export function injector(keyValuePairs: {
    [x: string]: string | number;
}, { transformers, functions }: {
    [x: string]: any;
}, globalCtx: GlobalContext): (text: any, localCtx: any) => any;
export const join: (...args: any[]) => string;
export const keyPatternString: "{{s*[a-zA-Z_|0-9- ()]+s*}}";
export function extractKey(k: any): any;
export function isAFunctionKey(key: any): boolean;
