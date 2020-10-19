import * as fs from 'fs-extra';
import * as tmp from 'tmp';
import { execSync } from 'child_process';
import axios from 'axios';
import gitUrlParse from 'git-url-parse';
import { allPass } from 'ramda';
import { CommandsToPaths } from '../commandsBuilder';
import { accessSync } from 'fs-extra';
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


	async listTemplates(): Promise<CommandsToPaths> {
		const { owner, name, href } = gitUrlParse(this.gitSrc);
		console.log(owner, name);
		const apiUrl = `https://api.github.com/repos/${owner}/${name}/git/trees/master?recursive=true`;
		const { tree } = await axios.get(apiUrl).then(({ data }) => data);

		const isTemplate = (({ path }) => path.startsWith('scaffolder') && path.split('/').length === 2);
		const notConfig = (({ path }) => !path.endsWith('scaffolder.config.js'));
		const toTemplate = (acc, { path }) => ({...acc, [path.split('/').pop()]: `Remote: ${href}/${path}`});

		return tree.filter(allPass([isTemplate, notConfig])).reduce(toTemplate, {});
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

}

