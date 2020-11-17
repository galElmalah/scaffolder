import {contextFactory} from '.';

const fakeLogger = {
	info: () => {},
	warning: () => {},
	error: () => {},
};

const baseContext = {
	parametersValues: {},
	templateName: '',
	templateRoot: '',
	targetRoot: '',
	logger: fakeLogger,
};

describe('contextFactory', () => {
	it('should return a partially applied function', () => {
		expect(contextFactory(baseContext)).toBeInstanceOf(Function);
	});
  
	it('should create a base context when called without overrides', () => {
		const makeContext = contextFactory(baseContext);
		expect(makeContext()).not.toBe(baseContext);
		expect(makeContext()).toEqual(baseContext);
	});
  
	it('should apply overrides', () => {
		const makeContext = contextFactory(baseContext);
		const context = makeContext({parametersValues: {gal:1}});
		expect(context.parametersValues.gal).toBe(1);
	});
  
});