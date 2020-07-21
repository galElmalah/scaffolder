const { MissingTransformerImplementation } = require("../../Errors");

const defaultTransformers = {
  toLowerCase: (value) => value.toLowerCase(),
  toUpperCase: (value) => value.toLowerCase(),
  capitalize: (value) => `${value[0].toUpperCase()}${value.substring(1)}`,
  toCamelCase: (value) => value.replace(/([-_]\w)/g, (g) => g[1].toUpperCase()),
  camelCaseToSnakeCase: (value) =>
    value.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`),
  camelCaseToKabebCase: (value) =>
    value.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`),
};

const applyTransformers = (initialValue, transformersMap, transformersKeys) => {
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
      return transformerFunction(currValue);
    }, initialValue);
};

module.exports = {
  applyTransformers,
};
