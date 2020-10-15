"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatesBuilder = void 0;
var fs_1 = __importDefault(require("fs"));
var fs_extra_1 = require("fs-extra");
var Errors_1 = require("../Errors");
var filesUtils_1 = require("../filesUtils");
var writeFilePromise = function (path, content) {
    return new Promise(function (resolve, reject) {
        fs_1.default.writeFile(path, content, function (err) {
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
            if (fs_1.default.existsSync(newFolderPath)) {
                throw new Errors_1.FolderAlreadyExists({
                    cmd: this.cmd,
                    folder: this.folder,
                    path: newFolderPath,
                });
            }
            fs_1.default.mkdirSync(newFolderPath);
        }
    };
    TemplatesBuilder.prototype.createTemplateFolder = function (folderDescriptor, root) {
        var _this = this;
        return fs_extra_1.mkdir(filesUtils_1.join(root, folderDescriptor.name)).then(function () {
            return Promise.all(folderDescriptor.content.map(function (descriptor) {
                try {
                    if (descriptor.type === "FOLDER" /* FOLDER */) {
                        return _this.createTemplateFolder(descriptor, filesUtils_1.join(root, folderDescriptor.name));
                    }
                    return writeFilePromise(filesUtils_1.join(root, folderDescriptor.name, descriptor.name), descriptor.content).catch(function (e) { return console.log('Error::createTemplateFolder::', e); });
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
            var path = filesUtils_1.join(_this.entryPoint, _this.pathPrefix, _this.folder, template.name);
            if (template.type) {
                promises.push(_this.createTemplateFolder(template, filesUtils_1.join(_this.entryPoint, _this.pathPrefix, _this.folder)));
                return;
            }
            promises.push(writeFilePromise(path, template.content));
        });
        return promises;
    };
    TemplatesBuilder.prototype.getFullPath = function () {
        return filesUtils_1.join(this.entryPoint, this.pathPrefix, this.folder);
    };
    return TemplatesBuilder;
}());
exports.TemplatesBuilder = TemplatesBuilder;
//# sourceMappingURL=index.js.map