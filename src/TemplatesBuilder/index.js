const fs = require('fs');
const { join } = require('../templatesCreator');
const { FolderAlreadyExists } = require('../../Errors');

const writeFilePromise = (path, content) =>
  new Promise((resolve, reject) => {
    fs.writeFile(path, content, err => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });

class TemplatesBuilder {
  constructor(templates, cmd) {
    this.templates = templates;
    this.folder = '';
    this.cmd = cmd;
  }

  inAFolder(folderName) {
    this.folder = folderName;
    const newFolderPath = this.getFullPath();

    if (fs.existsSync(newFolderPath)) {
      throw new FolderAlreadyExists({
        cmd: this.cmd,
        folder: this.folder,
        path: newFolderPath,
      });
    }
    fs.mkdirSync(newFolderPath);
    return this;
  }

  create() {
    const promises = [];
    this.templates.forEach(({ name, content }) => {
      const path = join(process.cwd(), this.folder, name);
      promises.push(writeFilePromise(path, content));
    });
    return promises;
  }

  getFullPath() {
    return join(process.cwd(), this.folder);
  }
}

module.exports = TemplatesBuilder;
