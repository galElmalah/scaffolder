"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTransformationsFromKey = void 0;
var Errors_1 = require("../Errors");
var defaultTransformers_1 = require("./defaultTransformers");
exports.removeTransformationsFromKey = function (key) {
    if (key === void 0) { key = ''; }
    return key.replace(/\|.*/g, '}}').replace(/\s*/g, '');
};
var applyTransformers = function (initialValue, transformersMap, transformersKeys, ctx) {
    return transformersKeys
        .map(function (t) { return t.trim(); })
        .reduce(function (currValue, nextTranformerKey) {
        var transformerFunction = transformersMap[nextTranformerKey] ||
            defaultTransformers_1.defaultTransformers[nextTranformerKey];
        if (!transformerFunction) {
            throw new Errors_1.MissingTransformerImplementation({
                transformationKey: nextTranformerKey,
            });
        }
        return transformerFunction(currValue, ctx);
    }, initialValue);
};
exports.default = {
    applyTransformers: applyTransformers,
    removeTransformationsFromKey: exports.removeTransformationsFromKey,
};
//# sourceMappingURL=applyTransformers.js.map