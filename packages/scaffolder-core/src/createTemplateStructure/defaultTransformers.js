module.exports.defaultTransformers = {
	toLowerCase: (value) => value.toLowerCase(),
	toUpperCase: (value) => value.toLowerCase(),
	capitalize: (value) => `${value[0].toUpperCase()}${value.substring(1)}`,
	toCamelCase: (value) => value.replace(/([-_]\w)/g, (g) => g[1].toUpperCase()),
	camelCaseToSnakeCase: (value) =>
		value.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`),
	camelCaseToKebabCase: (value) =>
		value.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
};
