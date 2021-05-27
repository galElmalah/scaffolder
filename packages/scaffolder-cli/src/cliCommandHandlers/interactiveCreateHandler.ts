import { handleError } from '../cliHelpers';

import { GithubTempCloner, commandsBuilder, getRemotes, CommandType } from 'scaffolder-core';
import { spinners } from './spinners';
import { githubFlow } from './interactiveGithubFlow';
import { getChosenTemplate } from './getChosenTemplate';
import { createChosenTemplate } from './createChosenTemplate';
import {Command} from 'commander';

export const interactiveCreateCommandHandler = async (command: Command) => {
	const gitCloner = new GithubTempCloner();

	try {
		if (command.fromGithub) {
			await createATemplateWithGithubFlow(gitCloner, command, command.fromGithub, command.template);
		} else {
			const availableTemplateCommands = commandsBuilder(process.cwd());
			const remotes = await getRemotes();
			const templatesAndRemotes = {
				...availableTemplateCommands,...remotes
			};

			const { chosenTemplateName } = await getChosenTemplate(
				templatesAndRemotes,
				command.template
			);			

			const chosenTemplateOrScope = templatesAndRemotes[chosenTemplateName];

			if(chosenTemplateOrScope.type === CommandType.REMOTE) {
				await createATemplateWithGithubFlow(gitCloner, command, chosenTemplateOrScope.location);
				return;
			}
			
			await createChosenTemplate(
				availableTemplateCommands,
				chosenTemplateOrScope.name as string,
				command
			);
		}
	} catch (err) {
		handleError(err);
		if (spinners.cloneTemplatesFromGithub.isSpinning) {
			spinners.cloneTemplatesFromGithub.fail('Failed to clone your templates.');
		}
	} finally {
		gitCloner.cleanUp();
	}
};
async function createATemplateWithGithubFlow(gitCloner: GithubTempCloner, command:Command ,githubSrc:string, preSelectedTemplate?:string) {
	const { availableTemplateCommands, chosenTemplate } = await githubFlow(
		gitCloner,
		githubSrc,
		preSelectedTemplate
	);
	await createChosenTemplate(
		availableTemplateCommands,
		chosenTemplate,
		command
	);
}

