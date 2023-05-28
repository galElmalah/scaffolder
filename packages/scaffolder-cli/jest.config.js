const baseJestConfig = require('../../jest.base.config.js');

module.exports = {
	...baseJestConfig,
	'transformIgnorePatterns': ['node_modules/(?!axios)']

};