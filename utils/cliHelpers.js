const generateKeyValues = cmd =>
  cmd.parent.rawArgs
    .slice(4)
    .map(keyValuePair => keyValuePair.split('='))
    .reduce((accm, [key, value]) => ({ ...accm, [key]: value }), {});

module.exports = { generateKeyValues };
