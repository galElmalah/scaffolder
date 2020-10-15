const {
	keyPatternString,
	isAFunctionKey,
} = require('../createTemplateStructure');
const { removeTransformationsFromKey } = require('../createTemplateStructure/applyTransformers');
const { TYPES } = require('../filesUtils');

const fillSetWithKeys = (keys, set) => {
	keys
		.filter((k) => !isAFunctionKey(k))
		.map(removeTransformationsFromKey)
		.forEach((k) => set.add(k));
};

export const getAllKeys = (templates, set) => {
	templates.forEach(({ name, content, type }) => {
		const keyRegex = new RegExp(keyPatternString, 'gi');
		if (type === TYPES.FOLDER) {
			const nameKeys = name.match(keyRegex) || [];
			fillSetWithKeys(nameKeys, set);
			getAllKeys(content, set).forEach((k) => set.add(k));
			return;
		}
		const nameKeys = name.match(keyRegex) || [];
		const contentKeys = content.match(keyRegex) || [];
		fillSetWithKeys([...nameKeys, ...contentKeys], set);
	});
	return Array.from(set.keys());
};


