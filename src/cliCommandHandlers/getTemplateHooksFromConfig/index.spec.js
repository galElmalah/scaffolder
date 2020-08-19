const TemplateHooksMustBeFunctions = require('../../../Errors/TemplateHooksMustBeFunctions.js');
const { getTemplateHooksFromConfig }= require('./index.js');
describe('getTemplateHooksFromConfig', () => {
	const templateName = 'my-template';

	it('should return all of the template hooks', () => {
		const preTemplateGeneration = () => {};
		const postTemplateGeneration = () => {};
		const aConfig = {
			templatesOptions: {
				[templateName]:{
					hooks: {
						preTemplateGeneration,
						postTemplateGeneration
					} 
				}
			}
		};
		expect(getTemplateHooksFromConfig(aConfig, templateName))
			.toEqual({
				preTemplateGeneration,postTemplateGeneration 
			});
	});

	it('should return an empty objects if a template don\'t have any options', () => {

		const aConfig = {
			templatesOptions: {}
		};
		expect(getTemplateHooksFromConfig(aConfig, templateName)).toEqual({});
	});

	it('should return an empty objects if a template don\'t have any hooks', () => {
		const aConfig = {
			templatesOptions: {
				[templateName]:{
					someOtherOption: {} 
				}
			}		
		};
		expect(getTemplateHooksFromConfig(aConfig, templateName)).toEqual({});
	});


	it('should throw a type error if the hooks are not functions', () => {
		const aConfig = {
			templatesOptions: {
				[templateName]:{
					hooks: {
						preTemplateGeneration:7,
						postTemplateGeneration:8
					} 
				}
			}		
		};
		expect(() => getTemplateHooksFromConfig(aConfig, templateName))
			.toThrowError(TemplateHooksMustBeFunctions);
	});
});