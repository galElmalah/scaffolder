import { Config } from './config';
import fs from 'fs';

export const getQuestionMessage = (
	parametersOptions = {},
	key: string
): string => {
	return (
		(parametersOptions[key] && parametersOptions[key].question) ||
    `Enter a value for the following parameter "${key}"`
	);
};

export const getValidationFunction = (parametersOptions = {}, key) => {
	const validationFn =
    parametersOptions[key] && parametersOptions[key].validation;
	if (!validationFn) {
		return;
	}
	return validationFn;
};



export const getConfigPath = (path: string) =>
	`${path.split('/').slice(0, -1).join('/')}/scaffolder.config.js`;


export const defaultConfig = ():Config => ({
	transformers: {},
	functions: {},
	parametersOptions: {},
	templatesOptions: {}
});

export const readConfig = (path: string) : Config => {
	let config = defaultConfig();
	const hasConfig = fs.existsSync(getConfigPath(path));
	if (hasConfig) {
		// Invalidate require cache to prevent stale configs
		delete require.cache[getConfigPath(path)];
		config = {
			...defaultConfig(), ...require(getConfigPath(path))
		};
	}
	return config;
};
