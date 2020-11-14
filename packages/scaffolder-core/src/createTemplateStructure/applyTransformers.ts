import { MissingTransformerImplementation } from '../Errors';
import { defaultTransformers } from './defaultTransformers';
import { trim } from 'ramda';
import { IConfig } from '../Config';

export const removeTransformationsFromKey = (key = '') => {
	return key.replace(/\|.*/g, '}}').replace(/\s*/g, '');
};


const toValueAfterTransformations = (config: IConfig, ctx) => (currValue, nextTransformerKey) => {
	const transformerFunction =
		config.get.transformer(nextTransformerKey) ||
		defaultTransformers[nextTransformerKey];
	if (!transformerFunction) {
		throw new MissingTransformerImplementation({
			transformationKey: nextTransformerKey,
		});
	}
	return transformerFunction(currValue, ctx);
};

export const applyTransformers = (
	initialValue,
	config:IConfig,
	transformersKeys,
	ctx
) => {
	return transformersKeys
		.map(trim)
		.reduce(toValueAfterTransformations(config, ctx), initialValue);
};

export default {
	applyTransformers,
	removeTransformationsFromKey,
};
