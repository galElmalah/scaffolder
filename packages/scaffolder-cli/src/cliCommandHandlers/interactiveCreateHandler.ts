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
			const { availableTemplateCommands, chosenTemplate } = await githubFlow(
				gitCloner,
				command.fromGithub,
				command.template
			);
			await createChosenTemplate(
				availableTemplateCommands,
				chosenTemplate,
				command
			);
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
			const chosenTemplateOrScope = templatesAndRemotes[chosenTemplateName.replace('[REMOTE] ','')];

			if(chosenTemplateOrScope.type === CommandType.REMOTE) {

				const { availableTemplateCommands, chosenTemplate } = await githubFlow(
					gitCloner,
					chosenTemplateOrScope.location,
					command.template
				);
				await createChosenTemplate(
					availableTemplateCommands,
					chosenTemplate,
					command
				);
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
