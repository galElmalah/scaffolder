module.exports = {
  transformers: {
    toUpper: (value) => value.toUpperCase(),
    test: (value, ctx) => JSON.stringify(ctx),
  },
};
