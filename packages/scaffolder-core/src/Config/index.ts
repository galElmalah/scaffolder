import {
	Dictionary,
	ParameterOptions,
	ScaffolderTransformer,
	ScaffolderFunction,
} from '../configHelpers/config';

interface ConfigGetters {
	parameterOptions(parameter: string): ParameterOptions;
	transformer(transformer: string): ScaffolderTransformer;
	function(aFunction: string): ScaffolderFunction;
}

interface IConfig {
	forTemplate(templateName: string): IConfig;
	get: ConfigGetters;
}

type ScopedProps = 'parametersOptions' | 'transformers' | 'functions';

export class Config implements IConfig {
	private configJson: Dictionary<any>;
	private templateName: string;
	constructor(configJson: Dictionary<any>) {
		this.configJson = configJson;
	}

	forTemplate(templateName: string) {
		this.templateName = templateName;
		return this;
	}

	private getFromTemplateScope(prop: ScopedProps, field: string) {
		const hasTemplateOptions = this.configJson.templatesOptions[
			this.templateName
		];
		if (!hasTemplateOptions) {
			return;
		}
		const hasPropOptions = this.configJson.templatesOptions[this.templateName][
			prop
		];
		if (hasPropOptions) {
			return this.configJson.templatesOptions[this.templateName][prop][field];
		}
	}

	private getFromFirstLevel(prop: ScopedProps, field: string) {
		if (!this.configJson[prop]) {
			return;
		}
		return this.configJson[prop][field];
	}

	private getFromConfig(prop: ScopedProps, field: string, defaultValue?: any) {
		return (
			this.getFromTemplateScope(prop, field) ||
			this.getFromFirstLevel(prop, field) ||
			defaultValue
		);
	}

	get = {
		parameterOptions: (parameter: string) => {
			return this.getFromConfig('parametersOptions', parameter);
		},
		transformer: (transformer: string) => {
			return this.getFromConfig('transformers', transformer);
		},
		function: (aFunction: string) => {
			return this.getFromConfig('functions', aFunction);
		},
	};
}
