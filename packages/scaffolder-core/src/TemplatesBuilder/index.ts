import fs from 'fs';
import { mkdir } from 'fs-extra';
import { FolderAlreadyExists } from '../Errors';
import { join, TYPES } from '../filesUtils';
import {path as pathColor, boldGreen, bold} from '../cliHelpers/colors';
import {createMissingFoldersInPath} from './createMissingFoldersInPath';

const writeFilePromise = (path: string, content: string) =>
	new Promise((resolve, reject) => {
		fs.writeFile(path, content, (err) => {
			if (err) {
				reject(err);
			}
			resolve(true);
		});
	});

export class TemplatesBuilder {
	templates: any;
	pathPrefix: string;
	folder: string;
	cmd: string;
	entryPoint: string;
	onFileWrite: (filesWritten: number) => void;

	counter: number;
	constructor(
		templates,
		cmd?: any,
		onFileWrite?: (filesWritten: number) => void
	) {
		this.templates = templates;
		this.pathPrefix = '';
		this.folder = '';
		this.cmd = cmd;
		this.onFileWrite = onFileWrite;
		this.entryPoint = process.cwd();
		this.counter = 0;
	}

	handleFileWrite = (data) => {
		this.counter += 1;

		if (this.onFileWrite) {
			this.onFileWrite(this.counter);
		}

		return data;
	}

	withCustomEntryPoint(entryPoint: string) {
		this.entryPoint = entryPoint;
		return this;
	}

	withPathPrefix(pathPrefix: string) {
		this.pathPrefix = pathPrefix;
		return this;
	}

	inAFolder(folderName: string) {
		this.folder = folderName;
		return this;
	}

	createMissingPathPartsIfNeeded() {
		this.createMissingPathPrefixFolders();
		this.createContainingFolder();
	}

	private createContainingFolder() {
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

	private createMissingPathPrefixFolders() {
		const missingPaths = createMissingFoldersInPath(this.entryPoint, this.pathPrefix);
		if (missingPaths.length) {
			this.logMissingFoldersInPrefixPathDetected(missingPaths);
		}
	}

	private logMissingFoldersInPrefixPathDetected(missingPaths) {
		const colorEndOfPath = (path) => {
			const [last, ...restOfPath] = path.split('/').reverse();
			return `${restOfPath.reverse().join('/')}/${boldGreen(last)}`;
		};
		const missingPathsString = missingPaths.reduce((paths, path) => `${paths}\n${colorEndOfPath(path)}`, '');
		console.log(bold(`Scaffolder Detected that your prefix path (${pathColor(this.pathPrefix)}) contains non existing folders and will automatically create them for you.`), missingPathsString);
	}

	createTemplateFolder(folderDescriptor, root) {
		return mkdir(join(root, folderDescriptor.name)).then(() => {
			return Promise.all(
				folderDescriptor.content.map((descriptor) => {
					try {
						if (descriptor.type === TYPES.FOLDER) {
							return this.createTemplateFolder(
								descriptor,
								join(root, folderDescriptor.name)
							).then(this.handleFileWrite);
						}
						return writeFilePromise(
							join(root, folderDescriptor.name, descriptor.name),
							descriptor.content
						)
							.then(this.handleFileWrite)
							.catch((e) => console.log('Error::createTemplateFolder::', e));
					} catch (e) {
						console.log('Error::createTemplateFolder::', e);
					}
				})
			);
		});
	}

	build(): Promise<any>[] {
		this.createMissingPathPartsIfNeeded();
		const promises = [];
		this.templates.forEach((template) => {
			const path = join(
				this.entryPoint,
				this.pathPrefix,
				this.folder,
				template.name
			);
			if (template.type) {
				promises.push(
					this.createTemplateFolder(
						template,
						join(this.entryPoint, this.pathPrefix, this.folder)
					)
				);
				return;
			}
			promises.push(writeFilePromise(path, template.content));
		});
		return promises;
	}

	getFullPath() {
		return join(this.entryPoint, this.pathPrefix, this.folder);
	}
}
