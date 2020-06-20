const fs = require("fs");
const { mkdir } = require("fs-extra");
const { FolderAlreadyExists } = require("../../Errors");
const { join } = require("../filesUtils");

const writeFilePromise = (path, content) =>
  new Promise((resolve, reject) => {
    fs.writeFile(path, content, (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });

class TemplatesBuilder {
  constructor(templates, cmd) {
    this.templates = templates;
    this.folder = "";
    this.cmd = cmd;
    this.entryPoint = process.cwd();
  }

  withCustomEntryPoint(entryPoint) {
    this.entryPoint = entryPoint;
    return this;
  }

  inAFolder(folderName) {
    this.folder = folderName;
    return this;
  }

  createFolderIfNeeded() {
    if (this.folder) {
      const newFolderPath = this.getFullPath();
      if (fs.existsSync(newFolderPath)) {
        throw new FolderAlreadyExists({
          cmd: this.cmd,
          folder: this.folder,
          path: newFolderPath,
        });
      }
      fs.mkdirSync(newFolderPath);
    }
  }

  createTemplateFolder(folderDescriptor, root) {
    return mkdir(join(root, folderDescriptor.name)).then(() => {
      return folderDescriptor.content.map((descriptor) => {
        try {
          if (descriptor.type === "FOLDER") {
            return this.createTemplateFolder(
              descriptor,
              join(root, folderDescriptor.name)
            );
          }
          return writeFilePromise(
            join(root, folderDescriptor.name, descriptor.name),
            descriptor.content
          );
        } catch (e) {
          console.log("Error::createTemplateFolder::", e);
        }
      });
    });
  }

  build() {
    this.createFolderIfNeeded();
    const promises = [];
    this.templates.forEach((template) => {
      const path = join(this.entryPoint, this.folder, template.name);
      if (template.type) {
        promises.push(
          this.createTemplateFolder(
            template,
            join(this.entryPoint, this.folder)
          )
        );
        return;
      }
      promises.push(writeFilePromise(path, template.content));
    });
    return promises;
  }

  getFullPath() {
    return join(this.entryPoint, this.folder);
  }
}

module.exports = TemplatesBuilder;
