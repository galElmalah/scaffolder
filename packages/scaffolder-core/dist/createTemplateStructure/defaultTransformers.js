module.exports.defaultTransformers = {
    toLowerCase: function (value) { return value.toLowerCase(); },
    toUpperCase: function (value) { return value.toLowerCase(); },
    capitalize: function (value) { return "" + value[0].toUpperCase() + value.substring(1); },
    toCamelCase: function (value) { return value.replace(/([-_]\w)/g, function (g) { return g[1].toUpperCase(); }); },
    camelCaseToSnakeCase: function (value) {
        return value.replace(/[A-Z]/g, function (m) { return "_" + m.toLowerCase(); });
    },
    camelCaseToKebabCase: function (value) {
        return value.replace(/[A-Z]/g, function (m) { return "-" + m.toLowerCase(); });
    },
};
//# sourceMappingURL=defaultTransformers.js.map