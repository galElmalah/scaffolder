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

export const isAValidGithubSource = (src) =>
// eslint-disable-next-line no-useless-escape
	/(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/.test(
		src
	);
