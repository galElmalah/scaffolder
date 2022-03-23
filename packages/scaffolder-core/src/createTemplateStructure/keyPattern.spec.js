const { keyPatternString } = require('./index');

const wrap = (str) => `{{${str}}}`;
describe('key pattern regex', () => {
	it('should match words inside a key format', () => {
		const keyPatternRegex = new RegExp(keyPatternString);
		const [
			first,
			keyWithLowerDash,
			keyWithHyphen,
			keyWithSpaces,
			keyWithTransformers,
		] = [
			'firstKey',
			'SECOND_KEY',
			'Another-key',
			'key with spaces',
			'key | with | spaces',
		].map(wrap);

		expect(keyPatternRegex.test(first)).toBe(true);
		expect(keyPatternRegex.test(keyWithLowerDash)).toBe(true);
		expect(keyPatternRegex.test(keyWithHyphen)).toBe(true);
		expect(keyPatternRegex.test(keyWithSpaces)).toBe(true);
		expect(keyPatternRegex.test(keyWithTransformers)).toBe(true);
	});
});
