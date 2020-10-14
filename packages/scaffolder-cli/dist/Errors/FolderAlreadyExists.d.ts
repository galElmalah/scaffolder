export = FolderAlreadyExists;
declare class FolderAlreadyExists extends Error {
    constructor({ cmd, folder, path }: {
        cmd: any;
        folder: any;
        path: any;
    });
    cmd: any;
    folder: any;
    path: any;
    getDisplayErrorMessage(): string;
}
