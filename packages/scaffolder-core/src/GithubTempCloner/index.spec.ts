import { GithubTempCloner } from '.';
import nock from 'nock';
import { aLocalCommand } from '../commandsBuilder/index.spec';

const responseData = require('./repoStructureApiReponse.json');

const mockTmpFolderDependency = () => jest.mock('tmp', () =>({dirSync: () => ({name:'gal'}),setGracefulCleanup: () =>{}}) );

mockTmpFolderDependency();

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
		aLocalCommand;
		const gitHttpsSrc = `https://github.com/${username}/${repo}.git`;

		const cloner = new GithubTempCloner(gitHttpsSrc);
		const templates = await cloner.listTemplates();
		const expectedTemplates = {
			'index':aLocalCommand(`${cloner.getTempDirPath()}/scaffolder/index`),
			'react-comp':aLocalCommand(`${cloner.getTempDirPath()}/scaffolder/react-comp`),
			'typescript-module':aLocalCommand(`${cloner.getTempDirPath()}/scaffolder/typescript-module`),
		};
		
		expect(templates).toEqual(expectedTemplates);
	});
});