export declare class TemplatesBuilder {
    templates: any;
    pathPrefix: string;
    folder: string;
    cmd: string;
    entryPoint: string;
    constructor(templates: any, cmd: any);
    withCustomEntryPoint(entryPoint: string): this;
    withPathPrefix(pathPrefix: string): this;
    inAFolder(folderName: string): this;
    createFolderIfNeeded(): void;
    createTemplateFolder(folderDescriptor: any, root: any): Promise<[unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown]>;
    build(): any[];
    getFullPath(): string;
}
