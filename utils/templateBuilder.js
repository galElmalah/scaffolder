const fs = require('fs');
const { join } = require('./templateCreator');

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
  constructor(templates) {
    this.templates = templates;
    this.folder = '/';
  }

  inAFolder(folderName) {
    this.folder = folderName;
    fs.mkdirSync(join(process.cwd(), this.folder));
    return this;
  }

  create() {
    const promises = [];
    this.templates.forEach(({ name, content }) => {
      const path = join(process.cwd(), this.folder, name);
      promises.push(writeFilePromise(path, content).catch(console.err));
    });
    return promises;
  }

  getFullPath() {
    return join(process.cwd(), this.folder);
  }
}

module.exports = TemplatesBuilder;
