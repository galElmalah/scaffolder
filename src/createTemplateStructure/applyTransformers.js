const { MissingTransformerImplementation } = require("../../Errors");
const { defaultTransformers } = require("./defaultTransformers");

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
