import { GithubTempCloner } from '.';

describe('GithubTempCloner', () => {
	it('should throw when setting invalid git src', () => {
		expect(() => new GithubTempCloner('gal')).toThrow(TypeError);
		const cloner = new GithubTempCloner();
		expect(() => cloner.setSrc('shit')).toThrow(TypeError);
	});
});