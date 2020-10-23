

import {
	getRepositorySource
} from './questions';
import {
	GithubTempCloner,
	readTemplatesFromPaths,
} from 'scaffolder-core';
import { spinners } from './spinners';
import { getChosenTemplate } from './getChosenTemplate';


export const githubFlow = async (gitCloner: GithubTempCloner, preSelectedTemplate?: string) => {
	const { repositorySource } = await getRepositorySource();
	gitCloner.setSrc(repositorySource);
	const listAvailableTemplates = async () => {
		spinners.listTemplatesFromGithub.start('Fetching available templates from Github...');
		try {
			const templatesList = await gitCloner.listTemplates();
			spinners.listTemplatesFromGithub.succeed();
			return templatesList;
		} catch (e) {
			spinners.listTemplatesFromGithub.fail(`Failed to fetch ${gitCloner.getParsedGitSrc().href} via github API.\nFalling back to cloning the repository.`);
			const directoryPath = await gitCloner.clone();
			return readTemplatesFromPaths([`${directoryPath}/scaffolder`]);
		}
	};

	const availableTemplateCommands = await listAvailableTemplates();
	const { chosenTemplate } = await getChosenTemplate(availableTemplateCommands, preSelectedTemplate);

	if (!gitCloner.hasCloned()) {
		spinners.cloneTemplatesFromGithub.start('Cloning templates from Github...');
		await gitCloner.clone();
		spinners.cloneTemplatesFromGithub.succeed();
	}

	return { chosenTemplate, availableTemplateCommands };
};