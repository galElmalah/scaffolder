

import {
	getRepositorySource
} from './questions';
import {
	GithubTempCloner,
	readTemplatesFromPaths,
} from 'scaffolder-core';
import { spinners } from './spinners';
import { getChosenTemplate } from './getChosenTemplate';


const getRepositorySourceIfNeeded = (repositorySource: string | boolean) => {
	if(repositorySource === true) {
		return getRepositorySource();
	}
	return {repositorySource };
};

const cloneRepo = async (gitCloner: GithubTempCloner): Promise<string| void> => {
	if (!gitCloner.hasCloned()) {
		spinners.cloneTemplatesFromGithub.start('Cloning templates from Github...');
		const directoryPath = await gitCloner.clone();
		spinners.cloneTemplatesFromGithub.succeed();
		return directoryPath;
	}
};

export const githubFlow = async (gitCloner: GithubTempCloner, repoSource?:string | boolean, preSelectedTemplate?: string) => {

	const { repositorySource } = await getRepositorySourceIfNeeded(repoSource);
	gitCloner.setSrc(repositorySource);
	const listAvailableTemplates = async () => {
		spinners.listTemplatesFromGithub.start('Fetching available templates from Github...');
		try {
			const templatesList = await gitCloner.listTemplates();
			spinners.listTemplatesFromGithub.succeed();
			return templatesList;
		} catch (e) {
			spinners.listTemplatesFromGithub.fail(`Failed to fetch ${gitCloner.getParsedGitSrc().href} via github API.\nFalling back to cloning the repository.`);
			const directoryPath = await cloneRepo(gitCloner);
			return readTemplatesFromPaths([`${directoryPath}/scaffolder`]);
		}
	};

	const availableTemplateCommands = await listAvailableTemplates();
	const { chosenTemplate } = await getChosenTemplate(availableTemplateCommands, preSelectedTemplate);

	await cloneRepo(gitCloner);


	return { chosenTemplate, availableTemplateCommands };
};