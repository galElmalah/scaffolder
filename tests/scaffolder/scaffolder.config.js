module.exports = {
	transformers: {
		toUpper: (value) => value.toUpperCase(),
		test: (value, ctx) => JSON.stringify(ctx),
	},
	functions: {
		date: (ctx) => {
			return `date:${new Date().getDate()}`;
		},

	},
	parametersOptions: {
		key1: {
			question: 'enter a value for this key',
			validation: (value) => {
				if(value.length < 3) {
					return 'the string must be at least 4 chars in length';
				}
				return true;
			}
		},
	},
	templatesOptions: {
		hooks: {
			'not-nested': {
				preTemplateGeneration: (ctx) => {
					console.log(ctx);
				}
			}
		}
	}
};
