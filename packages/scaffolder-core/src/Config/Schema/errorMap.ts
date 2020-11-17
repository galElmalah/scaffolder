import * as z from 'zod';
const errorObject = (ctx: any, error, field: string, expectedType: string) => ({
	message: `Invalid type "${typeof ctx.data}" at "${error.path.join(
		'.'
	)}". Scaffolder ${field} must be of type "${expectedType}".`,
});

const record = (type: string) => `Record, i.e [key:string]: ${type}`;

export const errorPathMap = (ctx, error, path) =>
	({
		transformers: errorObject(ctx, error, 'transformers', record('function')),
		functions: errorObject(ctx, error, 'functions', record('function')),
		parametersOptions: errorObject(
			ctx,
			error,
			'parametersOptions',
			record('{question?: string, validation?: function}')
		),
	}[path]);

export const errorMap: z.ZodErrorMap = (error, ctx) => {
	if (error.message) return { message: error.message };
	const _path = error.path.join('.');

	if (errorPathMap(ctx, error, _path)) {
		return errorPathMap(ctx, error, _path);
	}

	if (error.path[0] === 'templatesOptions') {
		const scopedPath = error.path.slice(0, 2).join('.');
		if (errorPathMap(ctx, error, scopedPath)) {
			return errorPathMap(ctx, error, scopedPath);
		}
	}

	switch (error.code) {
	case z.ZodErrorCode.invalid_union:
		if (error.path.includes('transformers')) {
			return errorObject(ctx, error, 'transformers', 'function');
		}
		if (error.path.includes('functions')) {
			return errorObject(ctx, error, 'functions', 'function');
		}
		break;
	case z.ZodErrorCode.invalid_type:
		if (error.path.includes('parametersOptions')) {
			return errorObject(
				ctx,
				error,
				'parameterOptions',
				'{question?: string, validation?: function}'
			);
		}
		break;
	case z.ZodErrorCode.unrecognized_keys: {
		if (error.path.includes('hooks')) {
			return errorObject(
				ctx,
				error,
				'template hooks',
				'{preTemplateGeneration?: function, postTemplateGeneration?: function}'
			);
		}
	}
	}

	return { message: ctx.defaultError };
};
