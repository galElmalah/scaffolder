import ora from 'ora';

export const spinners = {
	listTemplatesFromGithub:  ora(),
	cloneTemplatesFromGithub:  ora(),
	creatingTemplate:  ora(),
};

export const failAll = () => {
	Object.values(spinners).forEach(s => s.isSpinning && s.stop);
};