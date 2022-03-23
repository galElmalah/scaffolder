export const defaultTransformers = {
	toLowerCase: (value: string) => value.toLowerCase(),
	toUpperCase: (value: string) => value.toUpperCase(),
	capitalize: (value: string) => `${value[0].toUpperCase()}${value.substring(1)}`,
	toCamelCase: (value: string) => value.replace(/([-_]\w)/g, (g) => g[1].toUpperCase()),
	camelCaseToSnakeCase: (value: string) =>
		value.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`),
	camelCaseToKebabCase: (value: string) =>
		value.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
};
