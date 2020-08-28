const fs = require('fs');
const tmp = require('tmp');
const{ execSync } = require('child_process');

// make sure we delete all of the tmp files when the process exit.
tmp.setGracefulCleanup();

class GithubTempCloner {
	constructor(src, logger = console.log) {
		this.gitSrc = src;
		this.logger = logger;
		this.tmpFolderObject = null;
	}

	setSrc(src) {
		this.gitSrc = src;
	}

	getTempDirPath() {
		return this.tempDirPath;
	}
  
	clone() {
		this.tmpFolderObject= tmp.dirSync();
		this.logger('Creating temporary folder...');
		this.tempDirPath = this.tmpFolderObject.name;
		this.logger('Cloning repository...');
		execSync(`git clone --depth 1 ${this.gitSrc} ${this.tempDirPath}`, {
			stdio : 'pipe' 
		});
		this.logger('Finished cloning repository...');
		return this.tempDirPath;
	}

	cleanUp() {
		return new Promise((resolve, reject) => fs.rmdir(this.tempDirPath, {
			recursive: true 
		}, (err) => {
			if (err) {
				this.logger('Error while trying to delete git temp folder::', err);
				reject(err);
			}
			resolve();
			this.logger('Temp directory has been deleted.');
		})
		);
	}


}


module.exports = {
	GithubTempCloner
};