import * as z from 'zod';

const ScopedOptionsSchema = z.object({
	parametersOptions: z
		.record(
			z.object({
				question: z.string().optional(),
				validation: z.function().optional(),
			})
		)
		.optional(),
	transformers: z.record(z.function().optional()).optional(),
	functions: z.record(z.function().optional()).optional(),
});

export const ConfigSchema = z
	.object({
		templatesOptions: z.record(
			z
				.object({
					hooks: z
						.object({
							preTemplateGeneration: z.function().optional(),
							postTemplateGeneration: z.function().optional(),
						})
						.optional(),
				})
				.merge(ScopedOptionsSchema)
		),
	})
	.merge(ScopedOptionsSchema);
