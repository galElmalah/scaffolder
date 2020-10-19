import { GithubTempCloner } from '.';
import nock from 'nock';

const responseData = require('./repoStructureApiReponse.json');

describe('GithubTempCloner', () => {
	it('should throw when setting invalid git src', () => {
		expect(() => new GithubTempCloner('gal')).toThrow(TypeError);
		const cloner = new GithubTempCloner();
		expect(() => cloner.setSrc('shit')).toThrow(TypeError);
	});

	it('should list the user repositories', async () => {
		const username = 'gal';
		const repo = 'what-the';
		nock('https://api.github.com')
			.defaultReplyHeaders({
				'access-control-allow-origin': '*',
				'access-control-allow-credentials': 'true'
			})
			.get(`/repos/${username}/${repo}/git/trees/master?recursive=true`)
			.reply(200, responseData);

		const gitHttpsSrc = `https://github.com/${username}/${repo}.git`;

		const cloner = new GithubTempCloner(gitHttpsSrc);
		const templates = await cloner.listTemplates();
		const expectedTemplates = {
			'index':'Remote: https://github.com/gal/what-the.git/scaffolder/index',
			'react-comp':'Remote: https://github.com/gal/what-the.git/scaffolder/react-comp',
			'typescript-module':'Remote: https://github.com/gal/what-the.git/scaffolder/typescript-module'
		};
		expect(templates).toEqual(expectedTemplates);
	});
});