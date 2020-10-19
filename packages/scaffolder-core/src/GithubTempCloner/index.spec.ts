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
		const expectedTemplates = [
			{
				'location': 'https://github.com/gal/what-the.git',
				'name': 'index',
			},
			{
				'location': 'https://github.com/gal/what-the.git',
				'name': 'react-comp',
			},
			{
				'location': 'https://github.com/gal/what-the.git',
				'name': 'typescript-module'
			}];
		expect(templates).toEqual(expectedTemplates);
	});
});