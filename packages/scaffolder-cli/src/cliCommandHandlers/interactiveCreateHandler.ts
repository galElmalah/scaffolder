import { handleError } from '../cliHelpers';

import { GithubTempCloner, commandsBuilder } from 'scaffolder-core';
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
			const { chosenTemplate } = await getChosenTemplate(
				availableTemplateCommands,
				command.template
			);
			await createChosenTemplate(
				availableTemplateCommands,
				chosenTemplate,
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
