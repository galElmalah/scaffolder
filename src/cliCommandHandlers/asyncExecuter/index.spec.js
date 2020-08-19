describe('asyncExecuter', () => {
	it('should await for the promise to get resolved when given a promise', () => {
		let value;
		const p = Promise.resolve(7);
		p.then((v) => {
			value =v;
		});
	});
});