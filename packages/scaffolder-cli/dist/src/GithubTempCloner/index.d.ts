export class GithubTempCloner {
    constructor(src: any, logger?: (message?: any, ...optionalParams: any[]) => void);
    gitSrc: any;
    logger: (message?: any, ...optionalParams: any[]) => void;
    tmpFolderObject: any;
    setSrc(src: any): void;
    getTempDirPath(): any;
    clone(): any;
    tempDirPath: any;
    cleanUp(): Promise<any>;
}
