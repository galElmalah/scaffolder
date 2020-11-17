import {Config} from '.';
import {defaultConfig} from '../configHelpers';
import configObject from './fixtures/validConfig';
export const getConfigObject = (overrides:any = {}) => ({...defaultConfig(), ...overrides});

describe('Config', () => {

	describe('Config validations', () => {
		it('should not have any errors with he default config', () => {
			const errors = new Config(getConfigObject()).getSchemaErrors();
			expect(errors).toHaveLength(0);
		});
	
		it('should assert the config is not empty', () => {
			const errors = new Config({}).getSchemaErrors();
			expect(errors.length).toBeGreaterThan(0);
		});
	
		it('should assert that the parametersOptions have the right types', () => {
			const aConfigObject = getConfigObject({parametersOptions:{yo:'yo'}});
			const errors = new Config(aConfigObject).getSchemaErrors();
			expect(errors[0]).toEqual(expect.stringContaining('parametersOptions'));
		});
	
		it('should assert that the transformers have the right types', () => {
			const aConfigObject = getConfigObject({transformers: {gal:'not a function'}});
			const errors = new Config(aConfigObject).getSchemaErrors();
			expect(errors[0]).toEqual(expect.stringContaining('transformers'));
		});

		it('should assert first level options', () => {
			const aConfigObject = getConfigObject({transformers: '', functions: '', parametersOptions: ''});
			const errors = new Config(aConfigObject).getSchemaErrors();
			expect(errors.some(e => e.includes('transformers'))).toBeTruthy();
			expect(errors.some(e => e.includes('functions'))).toBeTruthy();
			expect(errors.some(e => e.includes('parametersOptions'))).toBeTruthy();
		});

		it('should detect transformers errors scoped to specific templates', () => {
			const errors = new Config(getConfigObject({templatesOptions:{someTemplate: {transformers: {l:'not a function'}} }})).getSchemaErrors();
			expect(errors).toHaveLength(1);
		});

		it('should detect hooks errors scoped to specific templates', () => {
			const errors = new Config(getConfigObject({templatesOptions:{someTemplate: {hooks: {l:'not a function'}} }})).getSchemaErrors();
			expect(errors).toHaveLength(1);
		});


		describe('validateConfig', () => {
			it('should throw an error when validating invalid config', () => {
				const aConfigObject = getConfigObject({transformers: {gal:'not a function'}, functions: {f:''},parametersOptions:{yo:'yo'}});
				expect(() => new Config(aConfigObject).validateConfig()).toThrowError();
			});

			it('should NOT throw an error when validating a valid config', () => {
				expect(() => new Config(configObject).validateConfig()).not.toThrowError();
			});

			it('should NOT throw an error when validating default config', () => {
				expect(() => new Config(getConfigObject()).validateConfig()).not.toThrowError();
			});
		});

	});


	describe('parametersOptions', () => {
		it('should return the parameter options from first level of config', () => {
			const template = 'some-template';
			const paramOne = 'paramOne';
			const config = new Config(configObject);
			config.forTemplate(template);
			expect(config.get.parameterOptions(paramOne)).toMatchObject(configObject.parametersOptions[paramOne]);
		});

		it('should return paramter options that are scoped to the template', () => {
			const templateWithScopedParameters = 'someTemplate';
			const paramOne = 'paramOne';
			const config = new Config(configObject);
			config.forTemplate(templateWithScopedParameters);
			expect(config.get.parameterOptions(paramOne)).toMatchObject(configObject.templatesOptions[templateWithScopedParameters].parametersOptions[paramOne]);
		});

		it('should return paramter options from first level if there aren\'t any scoped to the template', () => {
			const templateWithScopedParameters = 'someTemplate';
			const paramTwo = 'paramTwo';
			const config = new Config(configObject);
			config.forTemplate(templateWithScopedParameters);
			expect(config.get.parameterOptions(paramTwo)).toMatchObject(configObject.parametersOptions[paramTwo]);
		});

		it('should return default options for parameters without specified options' , () => {
			const templateWithScopedParameters = 'someTemplate';
			const testParam = 'testParam';
			const config = new Config(configObject);
			config.forTemplate(templateWithScopedParameters);
			expect(config.get.parameterOptions(testParam)).toEqual({question: expect.any(String)});
		});
	});

	describe('transformers', () => {
		it('should return the transformer from first level of config', () => {
			const template = 'some-template';
			const transformer = 'aTransformer';
			const config = new Config(configObject);
			config.forTemplate(template);
			expect(config.get.transformer(transformer)).toBeDefined();
			expect(config.get.transformer(transformer)).toBe(configObject.transformers.aTransformer);
		});

		it('should return the transformer that is scoped to the template', () => {
			const templateWithScopedParameters = 'someTemplate';
			const transformer = 'aTransformer';
			const config = new Config(configObject);
			config.forTemplate(templateWithScopedParameters);
			expect(config.get.transformer(transformer)).toBeDefined();

			expect(config.get.transformer(transformer)).toBe(configObject.templatesOptions[templateWithScopedParameters].transformers[transformer]);
		});

		it('should return the transformer from the first level if there aren\'t any scoped to the template', () => {
			const templateWithScopedParameters = 'someTemplate';
			const transformer = 'aTransformerTwo';
			const config = new Config(configObject);
			config.forTemplate(templateWithScopedParameters);
			expect(config.get.transformer(transformer)).toBeDefined();
			expect(config.get.transformer(transformer)).toBe(configObject.transformers[transformer]);
		});

		it('should return undefined if there is no such transformer', () => {
			const templateWithScopedParameters = 'someTemplate';
			const aNonExistingTransformer = 'aNonExistingTransformer';
			const config = new Config(configObject);
			config.forTemplate(templateWithScopedParameters);
			expect(config.get.transformer(aNonExistingTransformer)).toBe(undefined);
		});
	});


	describe('functions', () => {
		it('should return the function from first level of config', () => {
			const template = 'some-template';
			const aFunction = 'aFunction';
			const config = new Config(configObject);
			config.forTemplate(template);
			expect(config.get.function(aFunction)).toBeDefined();
			expect(config.get.function(aFunction)).toBe(configObject.functions.aFunction);
		});

		it('should return the function that is scoped to the template', () => {
			const templateWithScopedParameters = 'someTemplate';
			const aFunction = 'aFunction';
			const config = new Config(configObject);
			config.forTemplate(templateWithScopedParameters);		
			expect(config.get.function(aFunction)).toBeDefined();

			expect(config.get.function(aFunction)).toBe(configObject.templatesOptions[templateWithScopedParameters].functions[aFunction]);
		});


		it('should return the function from the first level if there aren\'t any scoped to the template', () => {
			const templateWithScopedParameters = 'someTemplate';
			const aFunction = 'aFunctionTwo';
			const config = new Config(configObject);
			config.forTemplate(templateWithScopedParameters);
			expect(config.get.function(aFunction)).toBeDefined();
			expect(config.get.function(aFunction)).toBe(configObject.functions[aFunction]);
		});

		it('should return undefined if there is no such function', () => {
			const templateWithScopedParameters = 'someTemplate';
			const aNonExistingFunction = 'aNonExistingFunction';
			const config = new Config(configObject);
			config.forTemplate(templateWithScopedParameters);
			expect(config.get.function(aNonExistingFunction)).toBe(undefined);
		});
	});

	describe('hooks', () => {
		it('should return an empty object if that template doesn\'t have hooks', () => {
			const template = 'some-template';
			const config = new Config(configObject);
			config.forTemplate(template);
			expect(config.get.hooks()).toEqual({});
		});

		it('should return all of the template hooks', () => {
			const template = 'someTemplate';
			const config = new Config(configObject);
			const numberOfPossibleHooks = 3;
			config.forTemplate(template);
			expect(config.get.hooks()).toBeDefined();
			expect(Object.keys(config.get.hooks())).toHaveLength(numberOfPossibleHooks);
			expect(config.get.hooks()).toEqual(configObject.templatesOptions[template].hooks);
		});
	});
});