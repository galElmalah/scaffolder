import * as fs from 'fs-extra';
import * as tmp from 'tmp';
import { spawn } from 'child_process';
import axios from 'axios';
import gitUrlParse from 'git-url-parse';
import { allPass } from 'ramda';
import { CommandsToPaths } from '../commandsBuilder';
const promisifedSpawn = (cmd, args, options) => new Promise((resolve, reject) => {
	const cp = spawn(cmd,args,options);
	cp.on('error',reject);
	cp.on('close',resolve);
});
// make sure we delete all of the tmp files when the process exit.
tmp.setGracefulCleanup();

export const isAValidGithubSource = (src) =>
	// eslint-disable-next-line no-useless-escape
	/(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/.test(
		src
	);

export interface GithubCloner {
	setSrc(src: string): void;
	getTempDirPath(): string;
	hasCloned(): boolean;
	getParsedGitSrc(): any;
	createTempDir(): void;
	listTemplates(): Promise<CommandsToPaths>;
	clone(): void;
	cleanUp(): void;
}

export class GithubTempCloner implements GithubCloner {
	private gitSrc: string;
	private logger: (...args: any) => void;
	private tmpFolderObject: any;
	private tempDirPath: string;
	private isCloned: boolean;
	constructor(src = '', logger = console.log) {
		src && this.setSrc(src);
		this.logger = logger;
		this.tmpFolderObject = null;
		this.tempDirPath = '';
		this.isCloned = false;
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

	hasCloned(): boolean {
		return this.isCloned;
	}

	createTempDir() {
		this.tmpFolderObject = tmp.dirSync();
	}

	getParsedGitSrc() {
		return gitUrlParse(this.gitSrc);
	}

	async listTemplates(): Promise<CommandsToPaths> {
		this.createTempDir();
		const { owner, name } = this.getParsedGitSrc();
		const apiUrl = `https://api.github.com/repos/${owner}/${name}/git/trees/master?recursive=true`;
		const { tree } = await axios.get(apiUrl).then(({ data }) => data);
		const isTemplate = ({ path }) =>
			path.startsWith('scaffolder') && path.split('/').length === 2;
		const notConfig = ({ path }) => !path.endsWith('scaffolder.config.js');
		const toTemplate = (acc, { path }) => ({
			...acc,
			[path.split('/').pop()]: `${this.getTempDirPath()}/${path}`,
		});

		return tree.filter(allPass([isTemplate, notConfig])).reduce(toTemplate, {});
	}

	async clone() {
		if (!this.tmpFolderObject) {
			this.createTempDir();
		}
		await promisifedSpawn('git', [
			'clone',
			'--depth=1',
			this.gitSrc,
			this.getTempDirPath(),
		],{stdio:'ignore'});
		this.isCloned = true;
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
			});
	}
}
