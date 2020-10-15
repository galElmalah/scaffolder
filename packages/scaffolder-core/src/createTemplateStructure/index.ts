const fs = require('fs');
const {
	NoMatchingTemplate,
	MissingKeyValuePairs,
	MissingFunctionImplementation,
} = require('../Errors');
const { isFolder, join, TYPES } = require('../filesUtils');
const { applyTransformers } = require('./applyTransformers').default;

export const defaultConfig = () => ({
	transformers: {},
	functions: {},
	parametersOptions: {},
	templatesOptions: {}
});

export const extractKey = (k) => k.replace(/({|})/g, '').trim();


export const isAFunctionKey = (key:string) => /.+\(\)/.test(key);

export const getKeyAndTransformers = (initialKey) =>
	extractKey(initialKey)
		.split('|')
		.map((_) => _.trim());

export const replaceKeyWithValue = (
	keyValuePairs,
	transformersMap,
	functionsMap,
	ctx
) => (match) => {
	if (isAFunctionKey(match)) {
		const functionKey = extractKey(match).replace(/\(|\)/g, '');
		if (!functionsMap.hasOwnProperty(functionKey)) {
			throw new MissingFunctionImplementation({
				functionKey 
			});
		}
		return functionsMap[functionKey](ctx);
	}

	const [key, ...transformersKeys] = getKeyAndTransformers(match);

	if (!keyValuePairs.hasOwnProperty(key)) {
		throw new MissingKeyValuePairs(match);
	}

	const keyInitialValue = keyValuePairs[key];

	return transformersKeys
		? applyTransformers(keyInitialValue, transformersMap, transformersKeys, ctx)
		: keyInitialValue;
};

export const createTemplateStructure = (folderPath) => {
	const folderContent = fs.readdirSync(folderPath);
	return folderContent.map((file) => {
		if (isFolder(folderPath, file)) {
			return {
				type: TYPES.FOLDER,
				name: file,
				content: createTemplateStructure(join(folderPath, file)),
				scaffolderTargetRoot: folderPath,
			};
		}
		return {
			name: file,
			content: fs.readFileSync(join(folderPath, file)).toString(),
			scaffolderTargetRoot: folderPath,
		};
	});
};

export const getConfigPath = (path) =>
	path.split('/').slice(0, -1).join('/') + '/scaffolder.config.js';

export const templateReader = (commands) => (cmd) => {
	let config = defaultConfig();
	if (!commands[cmd]) {
		throw new NoMatchingTemplate(cmd);
	}

	if (fs.existsSync(getConfigPath(commands[cmd]))) {
		// reset scaffolder config so I wont get old values.

		delete require.cache[getConfigPath(commands[cmd])];
		config = {
			...defaultConfig(), ...require(getConfigPath(commands[cmd])) 
		};
	}

	return {
		config,
		currentCommandTemplate: createTemplateStructure(commands[cmd]),
	};
};

export const templateTransformer = (templateDescriptor, injector, globalCtx) => {
	const createLocalCtx = ({ type = 'FILE', scaffolderTargetRoot, name }) => {
		const currentFileLocationPath = scaffolderTargetRoot
			.split('scaffolder')
			.pop();
		const currentFilePath = `${globalCtx.targetRoot}${currentFileLocationPath}`;
		return {
			fileName: name, type, currentFilePath 
		};
	};
	
	const transformFile = (descriptor) => ({
		name: injector(
			descriptor.name,
			createLocalCtx({
				...descriptor, type: TYPES.FILE_NAME 
			})
		),
		content: injector(
			descriptor.content,
			createLocalCtx({
				...descriptor, type: TYPES.FILE_CONTENT 
			})
		),
	});

	const transformerFolder = (descriptor) => ({
		type: descriptor.type,
		name: injector(descriptor.name, createLocalCtx(descriptor)),
		content: templateTransformer(descriptor.content, injector, globalCtx),
	});
	
	return templateDescriptor.map((descriptor) => {
		if (descriptor.type === TYPES.FOLDER) {
			return transformerFolder(descriptor);
		}
		return transformFile(descriptor);
	});
};

export const keyPatternString = '{{s*[a-zA-Z_|0-9- ()]+s*}}';

export const injector = (
	keyValuePairs,
	{ transformers = {}, functions = {} } = {},
	globalCtx
) => (text, localCtx) => {
	const ctx = {
		...globalCtx, ...localCtx 
	};
	const keyPattern = new RegExp(keyPatternString, 'g');
	const replacer = replaceKeyWithValue(
		keyValuePairs,
		transformers,
		functions,
		ctx
	);
	const transformedText = text.replace(keyPattern, replacer);
	return transformedText;
};

