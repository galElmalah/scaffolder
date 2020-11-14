import {Config} from '.';

const configJSON = require('./fixtures/validConfig.js');

describe('Config', () => {

	describe('parametersOptions', () => {
		it('should return the parameter options from first level of config', () => {
			const template = 'some-template';
			const paramOne = 'paramOne';
			const config = new Config(configJSON);
			config.forTemplate(template);
			expect(config.get.parameterOptions(paramOne)).toMatchObject(configJSON.parametersOptions[paramOne]);
		});

		it('should return paramter options that are scoped to the template', () => {
			const templateWithScopedParameters = 'someTemplate';
			const paramOne = 'paramOne';
			const config = new Config(configJSON);
			config.forTemplate(templateWithScopedParameters);
			expect(config.get.parameterOptions(paramOne)).toBe(configJSON.templatesOptions[templateWithScopedParameters].parametersOptions[paramOne]);
		});

		it('should return paramter options from first level if there arent any scoped to the template', () => {
			const templateWithScopedParameters = 'someTemplate';
			const paramTwo = 'paramTwo';
			const config = new Config(configJSON);
			config.forTemplate(templateWithScopedParameters);
			expect(config.get.parameterOptions(paramTwo)).toBe(configJSON.parametersOptions[paramTwo]);
		});
	});

	describe('transformers', () => {
		it('should return the transformer from first level of config', () => {
			const template = 'some-template';
			const transformer = 'aTransformer';
			const config = new Config(configJSON);
			config.forTemplate(template);
			expect(config.get.transformer(transformer)).toBe(configJSON.transformers.aTransformer);
		});

		it('should return the transformer that is scoped to the template', () => {
			const templateWithScopedParameters = 'someTemplate';
			const transformer = 'aTransformer';
			const config = new Config(configJSON);
			config.forTemplate(templateWithScopedParameters);
			expect(config.get.transformer(transformer)).toBe(configJSON.templatesOptions[templateWithScopedParameters].transformers[transformer]);
		});


		it('should return the transformer from the first level if there aren\'t any scoped to the template', () => {
			const templateWithScopedParameters = 'someTemplate';
			const transformer = 'aTransformerTwo';
			const config = new Config(configJSON);
			config.forTemplate(templateWithScopedParameters);
			expect(config.get.transformer(transformer)).toBe(configJSON.transformers[transformer]);
		});
	});


	describe('functions', () => {
		it('should return the function from first level of config', () => {
			const template = 'some-template';
			const aFunction = 'aFunction';
			const config = new Config(configJSON);
			config.forTemplate(template);
			expect(config.get.function(aFunction)).toBe(configJSON.functions.aFunction);
		});

		it('should return the function that is scoped to the template', () => {
			const templateWithScopedParameters = 'someTemplate';
			const aFunction = 'afunction';
			const config = new Config(configJSON);
			config.forTemplate(templateWithScopedParameters);
			expect(config.get.function(aFunction)).toBe(configJSON.templatesOptions[templateWithScopedParameters].functions[aFunction]);
		});


		it('should return the function from the first level if there aren\'t any scoped to the template', () => {
			const templateWithScopedParameters = 'someTemplate';
			const aFunction = 'afunctionTwo';
			const config = new Config(configJSON);
			config.forTemplate(templateWithScopedParameters);
			expect(config.get.function(aFunction)).toBe(configJSON.functions[aFunction]);
		});
	});
});