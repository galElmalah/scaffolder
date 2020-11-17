import chalk from 'chalk';

export const error = chalk.bold.red;
export const warning = chalk.keyword('orange');
export const boldGreen = chalk.green.bold;
export const path = chalk.blue.underline.bold;
export const bold = chalk.bold;

export const  multiColors = word => {
	const colors = [
		chalk.greenBright,
		chalk.yellowBright,
		chalk.redBright,
		chalk.magentaBright,
		chalk.cyanBright,
	];
	const colorful = word
		.split('')
		.reduce((accm, char, i) => accm + colors[i % 5](char), '');

	return colorful;
};
