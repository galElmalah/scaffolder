const { asyncExecuter } = require('./index.js');
describe('asyncExecuter', () => {
	it('should call the function passes to it an await if the returned value is a promise', async () => {
		let value;
		const fn = jest.fn().mockResolvedValue(7);
		await asyncExecuter(fn).then(v => {
			value = v;
		});
    
		expect(value).toBe(7);
		expect(fn).toHaveBeenCalled();
	});
  
	it('should return the function value even if its not a promise', async () => {
		let value;
		const fn = jest.fn().mockReturnValue(7);
		await asyncExecuter(fn).then(v => {
			value = v;
		});
    
		expect(value).toBe(7);
		expect(fn).toHaveBeenCalled();
	});
  
	it('should catch a promise rejection', async () => {
		const fn = jest.fn(() => Promise.reject('error'));
		await asyncExecuter(fn);
		expect(fn).toHaveBeenCalled();
	});
  
	it('should catch errors from the executed function', async () => {
		const fn = jest.fn(() => {throw new Error();});
		await asyncExecuter(fn);
		expect(fn).toHaveBeenCalled();
	});
  
	it('should pass all arguments to the passed function', async () => {
		const fn = jest.fn();
		const args = [1,2,3];
		await asyncExecuter(fn,'','', ...args);
		expect(fn).toHaveBeenCalledWith(...args);
	});
});