import { warning as warningColor, error as errorColor, Logger } from 'scaffolder-core';

export const makeLogger = (): Logger => {
	return {
		warning: (msg = '\n') => console.log(`\n${warningColor(msg)}`),
		error: (msg = '\n') => console.log(`\n${errorColor(msg)}`),
		info: (msg = '\n') => console.log(`\n${msg}`),
	};
};
