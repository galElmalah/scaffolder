export = NoMatchingTemplate;
declare class NoMatchingTemplate extends Error {
    constructor(cmd: any);
    cmd: any;
    getDisplayErrorMessage(): string;
}
