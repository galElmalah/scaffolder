const fs = require('fs');
const path = require('path');
module.exports.isFolder = (basePath, filePath) => fs.lstatSync(path.resolve(basePath, filePath)).isDirectory();
module.exports.join = (...args) => path.join(...args);
module.exports.TYPES = {
    FOLDER: 'FOLDER',
    FILE: 'FILE',
    FILE_NAME: 'FILE_NAME',
    FILE_CONTENT: 'FILE_CONTENT',
};
//# sourceMappingURL=filesUtils.js.map