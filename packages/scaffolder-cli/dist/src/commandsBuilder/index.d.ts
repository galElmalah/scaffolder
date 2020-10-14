/**
 *
 * @param {string} currentPath Used as the root entry from which we start looking for scaffolder directories
 * @returns {Object.<string, string>} key value pairs where the key is the template command and the value is the path to that command
 */
export function commandsBuilder(currentPath: string): {
    [x: string]: string;
};
export function templatePathsFinder(currentPath: any): any;
export function readTemplatesFromPaths(paths: any): {};
export const SEARCH_DEPTH_LIMIT: 25;
