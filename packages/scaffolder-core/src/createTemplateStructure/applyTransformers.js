import { MissingTransformerImplementation } from '../Errors';
import { defaultTransformers } from './defaultTransformers';
import { trim } from 'ramda';

export const removeTransformationsFromKey = (key = '') => {
	return key.replace(/\|.*/g, '}}').replace(/\s*/g, '');
};


const toValueAfterTransformations = (transformersMap,ctx) => (currValue, nextTransformerKey) => {
	const transformerFunction =
		transformersMap[nextTransformerKey] ||
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
	transformersMap,
	transformersKeys,
	ctx
) => {
	return transformersKeys
		.map(trim)
		.reduce(toValueAfterTransformations(transformersMap,ctx), initialValue);
};

export default {
	applyTransformers,
	removeTransformationsFromKey,
};
