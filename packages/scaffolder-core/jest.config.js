const baseJestConfig = require('../../jest.base.config.js');
module.exports = {
	...baseJestConfig,
	modulePathIgnorePatterns: ['big-template-example']
};