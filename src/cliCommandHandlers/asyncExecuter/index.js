const defaultSuccessMessage = 'Successfully executed';
const defaultErrorMessage = 'Error in asyncExecutor';
const asyncExecuter = async (
	fn, 
	successMsg = defaultSuccessMessage,
	errMsg = defaultErrorMessage,
	...args
) => {
	if(fn){
		try {
			console.log(successMsg);
			const fnResult = fn(...args);
			return fnResult instanceof Promise ? await fnResult : fnResult;
		} catch(e) {
			const errorMessage = typeof errMsg === 'function'  ? errMsg(e) : errMsg;
			console.log(errorMessage);
		}
	}
};

module.exports = {
	asyncExecuter 
};