export declare const isFolder: (basePath: string, filePath: string) => boolean;
export declare const join: (...args: string[]) => string;
export declare const enum TYPES {
    FOLDER = "FOLDER",
    FILE = "FILE",
    FILE_NAME = "FILE_NAME",
    FILE_CONTENT = "FILE_CONTENT"
}
