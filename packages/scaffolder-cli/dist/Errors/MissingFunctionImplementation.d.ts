export = MissingFunctionImplementation;
declare class MissingFunctionImplementation extends Error {
    constructor({ functionKey }: {
        functionKey: any;
    });
    functionKey: any;
    getDisplayErrorMessage(): string;
}
