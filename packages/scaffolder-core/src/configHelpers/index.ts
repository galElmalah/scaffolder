export const getQuestionMessage = (
	parametersOptions = {},
	key: string
): string => {
	return (
		(parametersOptions[key] && parametersOptions[key].question) ||
    `Enter a value for the following parameter "${key}"`
	);
};

export const getValidationFunction = (parametersOptions = {}, key) => {
	const validationFn =
    parametersOptions[key] && parametersOptions[key].validation;
	if (!validationFn) {
		return;
	}
	return validationFn;
};

