const { MissingTransformerImplementation } = require('../../Errors');
const { defaultTransformers } = require('./defaultTransformers');

const removeTransformationsFromKey = (key = '') => {
	return key.replace(/\|.*/g, '}}').replace(/\s*/g, '');
};

const applyTransformers = (
	initialValue,
	transformersMap,
	transformersKeys,
	ctx
) => {
	return transformersKeys
		.map((t) => t.trim())
		.reduce((currValue, nextTranformerKey) => {
			const transformerFunction =
        transformersMap[nextTranformerKey] ||
        defaultTransformers[nextTranformerKey];
			if (!transformerFunction) {
				throw new MissingTransformerImplementation({
					transformationKey: nextTranformerKey,
				});
			}
			return transformerFunction(currValue, ctx);
		}, initialValue);
};

module.exports = {
	applyTransformers,
	removeTransformationsFromKey,
};
