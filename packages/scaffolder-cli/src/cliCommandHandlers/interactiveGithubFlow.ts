import { getRepositorySource } from './questions';
import { GithubTempCloner, readTemplatesFromPaths } from 'scaffolder-core';
import { spinners } from './spinners';
import { getChosenTemplate } from './getChosenTemplate';

const getRepositorySourceIfNeeded = (repositorySource: string | boolean) => {
	if (repositorySource === true) {
		return getRepositorySource();
	}
	return { repositorySource };
};

const cloneRepo = async (
	gitCloner: GithubTempCloner
): Promise<string | void> => {
	if (!gitCloner.hasCloned()) {
		spinners.cloneTemplatesFromGithub.start('Cloning templates from Github...');
		const directoryPath = await gitCloner.clone();
		spinners.cloneTemplatesFromGithub.succeed();
		return directoryPath;
	}
};

const stopSpinnersOnError = (source: string) => {
	spinners.listTemplatesFromGithub.isSpinning &&
		spinners.listTemplatesFromGithub.fail(
			`Failed to fetch ${source
			} via github API.\nFalling back to cloning the repository.`
		);
	spinners.cloneTemplatesFromGithub.isSpinning &&
		spinners.cloneTemplatesFromGithub.fail(
			`Failed to clone ${source}.`
		);
};

export const githubFlow = async (
	gitCloner: GithubTempCloner,
	repoSource?: string | boolean,
	preSelectedTemplate?: string
) => {
	const { repositorySource } = await getRepositorySourceIfNeeded(repoSource);
	gitCloner.setSrc(repositorySource);
	const listAvailableTemplates = async () => {
		try {
			if (!preSelectedTemplate) {
				spinners.listTemplatesFromGithub.start(
					'Fetching available templates from Github...'
				);
				const templatesList = await gitCloner.listTemplates();
				spinners.listTemplatesFromGithub.succeed();
				return templatesList;
			} else {
				const directoryPath = await cloneRepo(gitCloner);
				return readTemplatesFromPaths([`${directoryPath}/scaffolder`]);
			}
		} catch (e) {
			stopSpinnersOnError(gitCloner.getParsedGitSrc().href);
			const directoryPath = await cloneRepo(gitCloner);
			return readTemplatesFromPaths([`${directoryPath}/scaffolder`]);
		}
	};

	const availableTemplateCommands = await listAvailableTemplates();
	const { chosenTemplate } = await getChosenTemplate(
		availableTemplateCommands,
		preSelectedTemplate
	);

	await cloneRepo(gitCloner);

	return { chosenTemplate, availableTemplateCommands };
};
