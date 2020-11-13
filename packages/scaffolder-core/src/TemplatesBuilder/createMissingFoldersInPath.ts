import * as fs from 'fs';

export const createMissingFoldersInPath = (basePath: string, toPath: string) => {
	const missingFoldersPaths = [];
	if (!toPath) {
		return missingFoldersPaths;
	}
	let currentPath = basePath;
	toPath.split('/').forEach((part) => {
		currentPath += `/${part}`;
		if (!fs.existsSync(currentPath)) {
			missingFoldersPaths.push(currentPath);
			fs.mkdirSync(currentPath);
		}
	});
	return missingFoldersPaths;
};
