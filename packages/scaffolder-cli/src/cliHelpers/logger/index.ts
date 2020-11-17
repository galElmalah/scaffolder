import {warning as warningColor, error as errorColor, Logger} from 'scaffolder-core';

export const makeLogger = ():Logger => {
	return {
		warning: (msg?:string) => console.log(`\n${warningColor(msg)}`),
		error: (msg?:string) => console.log(`\n${errorColor(msg)}`),
		info: (msg?:string) => console.log(`\n${msg}`),
	};
};
