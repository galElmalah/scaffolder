export = MissingKeyValuePairs;
declare class MissingKeyValuePairs extends Error {
    constructor(key: any);
    key: any;
    getDisplayErrorMessage(): string;
}
