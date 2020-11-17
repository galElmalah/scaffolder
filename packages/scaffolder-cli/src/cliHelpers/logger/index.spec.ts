import {makeLogger} from '.';

describe('logger', () => {
	it('should have info, warning and error methods', () => {
		const aLogger = makeLogger();
		expect(aLogger.info).toBeInstanceOf(Function);
		expect(aLogger.warning).toBeInstanceOf(Function);
		expect(aLogger.error).toBeInstanceOf(Function);
	});
	it('should prefix each call with \\n', () => {
		const test = 'test';
		const spy = jest.spyOn(console, 'log');
		const aLogger = makeLogger();
		aLogger.info(test);
		aLogger.warning(test);
		aLogger.error(test);
		expect(spy).toHaveBeenCalledWith(`\n${test}`);
		expect(spy).toHaveBeenCalledTimes(3);
	});
});