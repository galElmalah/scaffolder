export = TemplatesBuilder;
declare class TemplatesBuilder {
    constructor(templates: any, cmd: any);
    templates: any;
    pathPrefix: string;
    folder: string;
    cmd: any;
    entryPoint: string;
    withCustomEntryPoint(entryPoint: any): TemplatesBuilder;
    withPathPrefix(pathPrefix: any): TemplatesBuilder;
    inAFolder(folderName: any): TemplatesBuilder;
    createFolderIfNeeded(): void;
    createTemplateFolder(folderDescriptor: any, root: any): Promise<[any, any, any, any, any, any, any, any, any, any]>;
    build(): any[];
    getFullPath(): string;
}
