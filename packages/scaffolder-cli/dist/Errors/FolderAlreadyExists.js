const { error, boldGreen, path } = require('../src/cliHelpers/colors');
class FolderAlreadyExists extends Error {
    constructor({ cmd, folder, path }) {
        super();
        this.cmd = cmd;
        this.folder = folder;
        this.path = path;
    }
    getDisplayErrorMessage() {
        const message = `${error(`Error while creating the "${boldGreen(this.cmd)}" template.`)}\nThere is probably a folder with the same name as "${boldGreen(this.folder)}"\nAt the location ${path(this.path)}
          `;
        return message;
    }
    get name() {
        return 'FolderAlreadyExists';
    }
}
module.exports = FolderAlreadyExists;
//# sourceMappingURL=FolderAlreadyExists.js.map