"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubTempCloner = void 0;
var fs = require('fs');
var tmp = require('tmp');
var execSync = require('child_process').execSync;
// make sure we delete all of the tmp files when the process exit.
tmp.setGracefulCleanup();
var GithubTempCloner = /** @class */ (function () {
    function GithubTempCloner(src, logger) {
        if (logger === void 0) { logger = console.log; }
        this.gitSrc = src;
        this.logger = logger;
        this.tmpFolderObject = null;
    }
    GithubTempCloner.prototype.setSrc = function (src) {
        this.gitSrc = src;
    };
    GithubTempCloner.prototype.getTempDirPath = function () {
        return this.tempDirPath;
    };
    GithubTempCloner.prototype.clone = function () {
        this.tmpFolderObject = tmp.dirSync();
        this.logger('Creating temporary folder...');
        this.tempDirPath = this.tmpFolderObject.name;
        this.logger('Cloning repository...');
        execSync("git clone --depth 1 " + this.gitSrc + " " + this.tempDirPath, {
            stdio: 'pipe'
        });
        this.logger('Finished cloning repository...');
        return this.tempDirPath;
    };
    GithubTempCloner.prototype.cleanUp = function () {
        var _this = this;
        if (!this.gitSrc || !this.tmpFolderObject) {
            return;
        }
        return new Promise(function (resolve, reject) { return fs.rmdir(_this.tempDirPath, {
            recursive: true
        }, function (err) {
            if (err) {
                _this.logger('Error while trying to delete git temp folder::', err);
                reject(err);
            }
            resolve();
            _this.logger('Temp directory has been deleted.');
        }); });
    };
    return GithubTempCloner;
}());
exports.GithubTempCloner = GithubTempCloner;
//# sourceMappingURL=index.js.map