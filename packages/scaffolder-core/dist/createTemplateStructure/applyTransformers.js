"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Errors_1 = require("../Errors");
var defaultTransformers_1 = require("./defaultTransformers");
var removeTransformationsFromKey = function (key) {
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
    removeTransformationsFromKey: removeTransformationsFromKey,
};
//# sourceMappingURL=applyTransformers.js.map