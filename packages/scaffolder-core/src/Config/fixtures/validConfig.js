module.exports = {
	parametersOptions: {
		paramOne: {
			question: 'a question',
			validation: () => {}
		},
		paramTwo: {
			question: 'a question',
			validation: () => {}
		}
	},
	transformers: {
		aTransformer: () => {},
		aTransformerTwo: () => {},
	},
	functions: {
		aFunction: () => {}, 
		aFunctionTwo: () => {}
	},
	templatesOptions: {
		someTemplate: {
			hooks: {
				preTemplateGeneration: () => {},
				postTemplateGeneration: () => {},				
				preAskingQuestions: () => {}
			},
			description: 'yo',
			parametersOptions: {
				paramOne: {
					question: 'another question',
					validation: () => {}
				}
			},
			transformers: {
				aTransformer: () => {},
			},
			functions: {
				aFunction: () => {}
			},
		}
	}
};