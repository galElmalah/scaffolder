import fs from 'fs';
import { mkdir } from 'fs-extra';
import { FolderAlreadyExists } from '../Errors';
import { join, TYPES } from '../filesUtils';

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

	constructor(templates, cmd) {
		this.templates = templates;
		this.pathPrefix = '';
		this.folder = '';
		this.cmd = cmd;
		this.entryPoint = process.cwd();
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
			return Promise.all(folderDescriptor.content.map((descriptor) => {
				try {
					if (descriptor.type === TYPES.FOLDER) {
						return this.createTemplateFolder(
							descriptor,
							join(root, folderDescriptor.name)
						);
					}
					return writeFilePromise(
						join(root, folderDescriptor.name, descriptor.name),
						descriptor.content
					).catch((e) => console.log('Error::createTemplateFolder::', e));
				} catch (e) {
					console.log('Error::createTemplateFolder::', e);
				}
			}));
		});
	}

	build() {
		this.createFolderIfNeeded();
		const promises = [];
		this.templates.forEach((template) => {
			const path = join(this.entryPoint, this.pathPrefix, this.folder, template.name);
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

