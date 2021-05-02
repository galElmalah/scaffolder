import { getRepositorySource } from './questions';
import { GithubTempCloner, readTemplatesFromPaths, bold, path } from 'scaffolder-core';
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
		try {
			const directoryPath = await gitCloner.clone();
			spinners.cloneTemplatesFromGithub.succeed();
			return directoryPath;
		} catch (e) {
			const { full_name, href, protocol } = gitCloner.getParsedGitSrc();

			stopSpinnersOnError(`${bold(full_name)} from ${path(href)}`);
			if (e === 128) {
				console.log(
					`it might be that you don't have permissions to read from: "${bold(full_name)}".\nPlease verify that you do and then try again.`
				);
				if (protocol === 'https') {
					console.log(
						bold('Tip: try using ssh instead of https and make sure your key is authorized.')
					);
				}
			}
			process.exit(1);
		}
	}
};

const stopSpinnersOnError = (source: string) => {
	spinners.listTemplatesFromGithub.isSpinning &&
    spinners.listTemplatesFromGithub.fail(
    	`Failed to fetch ${source} via github API.\nFalling back to cloning the repository.`
    );
	spinners.cloneTemplatesFromGithub.isSpinning &&
    spinners.cloneTemplatesFromGithub.fail(`Failed to clone ${source}.`);
};

export const githubFlow = async (
	gitCloner: GithubTempCloner,
	repoSource: string | boolean,
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
