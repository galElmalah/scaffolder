import * as fs from 'fs-extra';
import * as tmp from 'tmp';
import { execSync } from 'child_process';

// make sure we delete all of the tmp files when the process exit.
tmp.setGracefulCleanup();

export const isAValidGithubSource = (src) =>
	// eslint-disable-next-line no-useless-escape
	/(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/.test(
		src
	);

export class GithubTempCloner {
	private gitSrc: string;
	private logger: (...args: any) => void;
	private tmpFolderObject: any;
	private tempDirPath: string;
	constructor(src = '', logger = console.log) {
		src && this.setSrc(src);
		this.logger = logger;
		this.tmpFolderObject = null;
		this.tempDirPath = '';
	}

	setSrc(src: string) {
		if (!isAValidGithubSource(src)) {
			throw new TypeError(`Trying to set invalid github src: ${src}`);
		}
		this.gitSrc = src;
	}

	getTempDirPath() {
		return this.tmpFolderObject.name;
	}

	clone() {
		this.logger('Creating temporary folder...');
		this.tmpFolderObject = tmp.dirSync();
		this.logger('Cloning repository...');
		execSync(`git clone --depth=1 ${this.gitSrc} ${this.tempDirPath}`, {
			stdio: 'pipe',
		});
		this.logger('Finished cloning repository...');
		return this.getTempDirPath();
	}

	cleanUp() {
		if (!this.gitSrc || !this.tmpFolderObject) {
			return;
		}

		return fs
			.remove(this.getTempDirPath())
			.then(() => this.logger('Temp directory has been deleted.'))
			.catch((err) => {
				this.logger('Error while trying to delete git temp folder::', err);
				throw err;
			}
			);
	}
}
