"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatesBuilder = void 0;
var fs = require('fs');
var mkdir = require('fs-extra').mkdir;
var FolderAlreadyExists = require('../Errors').FolderAlreadyExists;
var _a = require('../filesUtils'), join = _a.join, TYPES = _a.TYPES;
var writeFilePromise = function (path, content) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(path, content, function (err) {
            if (err) {
                reject(err);
            }
            resolve(true);
        });
    });
};
var TemplatesBuilder = /** @class */ (function () {
    function TemplatesBuilder(templates, cmd) {
        this.templates = templates;
        this.pathPrefix = '';
        this.folder = '';
        this.cmd = cmd;
        this.entryPoint = process.cwd();
    }
    TemplatesBuilder.prototype.withCustomEntryPoint = function (entryPoint) {
        this.entryPoint = entryPoint;
        return this;
    };
    TemplatesBuilder.prototype.withPathPrefix = function (pathPrefix) {
        this.pathPrefix = pathPrefix;
        return this;
    };
    TemplatesBuilder.prototype.inAFolder = function (folderName) {
        this.folder = folderName;
        return this;
    };
    TemplatesBuilder.prototype.createFolderIfNeeded = function () {
        if (this.folder) {
            var newFolderPath = this.getFullPath();
            if (fs.existsSync(newFolderPath)) {
                throw new FolderAlreadyExists({
                    cmd: this.cmd,
                    folder: this.folder,
                    path: newFolderPath,
                });
            }
            fs.mkdirSync(newFolderPath);
        }
    };
    TemplatesBuilder.prototype.createTemplateFolder = function (folderDescriptor, root) {
        var _this = this;
        return mkdir(join(root, folderDescriptor.name)).then(function () {
            return Promise.all(folderDescriptor.content.map(function (descriptor) {
                try {
                    if (descriptor.type === TYPES.FOLDER) {
                        return _this.createTemplateFolder(descriptor, join(root, folderDescriptor.name));
                    }
                    return writeFilePromise(join(root, folderDescriptor.name, descriptor.name), descriptor.content).catch(function (e) { return console.log('Error::createTemplateFolder::', e); });
                }
                catch (e) {
                    console.log('Error::createTemplateFolder::', e);
                }
            }));
        });
    };
    TemplatesBuilder.prototype.build = function () {
        var _this = this;
        this.createFolderIfNeeded();
        var promises = [];
        this.templates.forEach(function (template) {
            var path = join(_this.entryPoint, _this.pathPrefix, _this.folder, template.name);
            if (template.type) {
                promises.push(_this.createTemplateFolder(template, join(_this.entryPoint, _this.pathPrefix, _this.folder)));
                return;
            }
            promises.push(writeFilePromise(path, template.content));
        });
        return promises;
    };
    TemplatesBuilder.prototype.getFullPath = function () {
        return join(this.entryPoint, this.pathPrefix, this.folder);
    };
    return TemplatesBuilder;
}());
exports.TemplatesBuilder = TemplatesBuilder;
//# sourceMappingURL=index.js.map