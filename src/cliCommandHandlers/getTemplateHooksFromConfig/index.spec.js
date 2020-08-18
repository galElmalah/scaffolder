const {getTemplateHooksFromConfig}= require('./index.js');
describe('getTemplateHooksFromConfig', () => {
	it('should return the hooks as a tuple', () => {
		const preTemplateGeneration = () => {};
		const postTemplateGeneration = () => {};
		const templateName = 'my-template';
		const aConfig = {
			templatesOptions: {
				[templateName]:{ hooks: {
					preTemplateGeneration,
					postTemplateGeneration
				}}
			}
		};
		expect(getTemplateHooksFromConfig(aConfig, templateName)).toEqual([preTemplateGeneration,postTemplateGeneration]);
	});
});