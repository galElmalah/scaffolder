import fs from 'fs';
import {
	NoMatchingTemplate,
	MissingKeyValuePairs,
	MissingFunctionImplementation,
} from '../Errors';
import { isFolder, join, TYPES } from '../filesUtils';
import { applyTransformers } from './applyTransformers';
import { Context } from '../context';
import { readConfig } from '../configHelpers';
import { curry } from 'ramda';
import { IConfig } from '../Config';

export interface TemplateStructure {
  name: string;
  type?: TYPES;
  content: string | TemplateStructure[];
  [key: string]: any;
}

export const extractKey = (k) => k.replace(/({|})/g, '').trim();

export const isAFunctionKey = (key: string) => /.+\(\)/.test(key);

export const getKeyAndTransformers = (initialKey) =>
	extractKey(initialKey)
		.split('|')
		.map((_) => _.trim());

export const replaceKeyWithValue = (
	keyValuePairs: { [x: string]: any },
	config: IConfig,
	ctx: Context
) => (match) => {
	if (isAFunctionKey(match)) {
		const functionKey = extractKey(match).replace(/\(|\)/g, '');
		const scaffolderFunction = config.get.function(functionKey);
		if (!scaffolderFunction) {
			throw new MissingFunctionImplementation({
				functionKey,
			});
		}
		return scaffolderFunction(ctx);
	}

	const [key, ...transformersKeys] = getKeyAndTransformers(match);

	if (!(key in keyValuePairs)) {
		throw new MissingKeyValuePairs(match);
	}

	const keyInitialValue = keyValuePairs[key];

	return transformersKeys
		? applyTransformers(keyInitialValue, config, transformersKeys, ctx)
		: keyInitialValue;
};

interface CreateTemplateStructure {
  templatesStructure: TemplateStructure[];
  filesCount: number;
}
export const createTemplateStructure = (
	folderPath: string
): CreateTemplateStructure => {
	let filesCount = 0;
	const createStructure = (fromPath:string): TemplateStructure[] => {
		const folderContent = fs.readdirSync(fromPath);
		const toTemplateStructure = (aFilePath:string): TemplateStructure => {
			filesCount++;
			if (isFolder(fromPath, aFilePath)) {
				return {
					type: TYPES.FOLDER,
					name: aFilePath,
					content: createStructure(join(fromPath, aFilePath)),
					scaffolderTargetRoot: fromPath,
				};
			}
			return {
				name: aFilePath,
				content: fs.readFileSync(join(fromPath, aFilePath)).toString(),
				scaffolderTargetRoot: fromPath,
			};
		};
		return folderContent.map(toTemplateStructure);
	};
	return { templatesStructure: createStructure(folderPath), filesCount };
};

export const templateReader = curry((commands, cmd) => {
	if (!commands[cmd]) {
		throw new NoMatchingTemplate(cmd);
	}

	const templates = createTemplateStructure(commands[cmd]);
	return {
		config: readConfig(commands[cmd]),
		currentCommandTemplate: templates.templatesStructure,
		filesCount: templates.filesCount,
	};
});

export const templateTransformer = (
	templateDescriptor: TemplateStructure[],
	injector,
	globalCtx
) => {
	const createLocalCtx = ({ type = 'FILE', scaffolderTargetRoot, name }) => {
		const currentFileLocationPath = scaffolderTargetRoot
			.split('scaffolder')
			.pop();
		const currentFilePath = `${globalCtx.targetRoot}${currentFileLocationPath}`;
		return {
			fileName: name,
			type,
			currentFilePath,
		};
	};

	const transformFile = (descriptor) => ({
		name: injector(
			descriptor.name,
			createLocalCtx({
				...descriptor,
				type: TYPES.FILE_NAME,
			})
		),
		content: injector(
			descriptor.content,
			createLocalCtx({
				...descriptor,
				type: TYPES.FILE_CONTENT,
			})
		),
	});

	const transformFolder = (descriptor) => ({
		type: descriptor.type,
		name: injector(descriptor.name, createLocalCtx(descriptor)),
		content: templateTransformer(descriptor.content, injector, globalCtx),
	});

	return templateDescriptor.map((descriptor) => {
		if (descriptor.type === TYPES.FOLDER) {
			return transformFolder(descriptor);
		}
		return transformFile(descriptor);
	});
};

export const keyPatternString = '{{s*[a-zA-Z_|0-9- ()]+s*}}';

export const injector = (keyValuePairs, config: IConfig, globalCtx) => (
	text,
	localCtx
) => {

	const ctx = {
		...globalCtx,
		...localCtx,
	};


	const keyPattern = new RegExp(keyPatternString, 'g');
	const replacer = replaceKeyWithValue(keyValuePairs, config, ctx);
	const transformedText = text.replace(keyPattern, replacer);
	return transformedText;
};
