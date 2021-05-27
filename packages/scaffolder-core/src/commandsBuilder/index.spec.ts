import fs from 'fs';
import { templatePathsFinder, commandsBuilder, SEARCH_DEPTH_LIMIT, CommandType, CommandEntry } from './index';
import { NoScaffolderFolder } from '../Errors';

jest.mock('fs');

const mockedReaddirSync = fs.readdirSync as jest.Mock;
const mockedLstatSync = fs.lstatSync as jest.Mock;
export const aLocalCommand = (location:string):CommandEntry => ({location, type:CommandType.LOCAL, name: location.split('/').pop()});


const path = 'g/d/a/s/d/f';

describe('commandsBuilder -> templatePathFinder', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('finds the scaffolder folder on the first level', () => {
		mockedReaddirSync
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValue([]);
		mockedLstatSync.mockReturnValue({
			isDirectory: () => true 
		});
		expect(templatePathsFinder(path)).toHaveLength(1);
	});

	it('finds the scaffolder folder not on the first level', () => {
		mockedReaddirSync
			.mockReturnValueOnce(['what', 'yeah'])
			.mockReturnValueOnce(['what', 'lala'])
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValue([]);

		mockedLstatSync.mockReturnValue({
			isDirectory: () => true 
		});
		templatePathsFinder(path);
	});

	it('it ignores the scaffolder if its a file and not a folder', () => {
		mockedReaddirSync
			.mockReturnValueOnce(['what', 'yeah'])
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValue([]);
		mockedLstatSync
			.mockReturnValueOnce({
				isDirectory: () => false 
			})
			.mockReturnValueOnce({
				isDirectory: () => true 
			});
		templatePathsFinder(path);

		expect(mockedReaddirSync).toHaveBeenCalledTimes(path.split('/').length);
	});

	it('throws an error if there is no scaffolder folder in the hierarchy', () => {
		mockedReaddirSync
			.mockReturnValueOnce(['what', 'yeah'])
			.mockReturnValueOnce(['what', '21'])
			.mockReturnValueOnce(['what', '12'])
			.mockReturnValue([]);
		mockedLstatSync.mockReturnValue({
			isDirectory: () => true 
		});

		expect(() => templatePathsFinder(path)).toThrow(NoScaffolderFolder);
	});

	it('finds all levels of scaffolder', () => {
		const path = '/home/gal/yeah';
		mockedReaddirSync
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValueOnce(['cmd1', 'cmd2'])
			.mockReturnValueOnce(['cmd3', 'cmd4'])
			.mockReturnValueOnce(['cmd5', 'cmd6']);
		mockedLstatSync.mockReturnValue({
			isDirectory: () => true 
		});

		expect(templatePathsFinder(path)).toHaveLength(3);
	});
});

describe('commandsBuilder -> commandsBuilder', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});


	it('builds the commands with the templates path from all levels', () => {
		const path = 'global/templatesAreHere/project';
		mockedReaddirSync
			.mockReturnValueOnce(['what', 'yeah'])
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValueOnce(['cmd1', 'cmd2', 'cmd3', 'cmd4', 'cmd5'])
			.mockReturnValueOnce(['cmd7', 'cmd6', 'cmd8', 'cmd9', 'cmd10']);

		mockedLstatSync.mockReturnValue({
			isDirectory: () => true 
		});
		expect(commandsBuilder(path)).toEqual({
			cmd1: aLocalCommand( 'global/templatesAreHere/scaffolder/cmd1'),
			cmd10: aLocalCommand( 'global/scaffolder/cmd10'),
			cmd2: aLocalCommand( 'global/templatesAreHere/scaffolder/cmd2'),
			cmd3: aLocalCommand( 'global/templatesAreHere/scaffolder/cmd3'),
			cmd4: aLocalCommand( 'global/templatesAreHere/scaffolder/cmd4'),
			cmd5: aLocalCommand( 'global/templatesAreHere/scaffolder/cmd5'),
			cmd6: aLocalCommand( 'global/scaffolder/cmd6'),
			cmd7: aLocalCommand( 'global/scaffolder/cmd7'),
			cmd8: aLocalCommand( 'global/scaffolder/cmd8'),
			cmd9: aLocalCommand( 'global/scaffolder/cmd9'),
		});
	});

	it('given two paths with the same template command the closer one will have precednce', () => {
		const path = 'global/templatesAreHere/project';
		mockedReaddirSync
			.mockReturnValueOnce(['what', 'yeah'])
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValueOnce(['cmd1', 'cmd2', 'cmd3', 'cmd4', 'cmd5'])
			.mockReturnValueOnce(['cmd1', 'cmd2', 'cmd6', 'cmd7', 'cmd5'])
			.mockReturnValueOnce(['cmd1', 'cmd2', 'cmd3', 'cmd4', 'cmd5']);

		mockedLstatSync.mockReturnValue({
			isDirectory: () => true 
		});

		expect(commandsBuilder(path)).toEqual({
			cmd1: aLocalCommand('global/templatesAreHere/scaffolder/cmd1'),
			cmd2: aLocalCommand('global/templatesAreHere/scaffolder/cmd2'),
			cmd3: aLocalCommand('global/templatesAreHere/scaffolder/cmd3'),
			cmd4: aLocalCommand('global/templatesAreHere/scaffolder/cmd4'),
			cmd5: aLocalCommand('global/templatesAreHere/scaffolder/cmd5'),
			cmd6: aLocalCommand('global/scaffolder/cmd6'),
			cmd7: aLocalCommand('global/scaffolder/cmd7'),
		});
	});

  
	it('does not exceed the max search depth', () => {
		const getAboveThresholdPath =() => {
			let path = '';
			for(let i = 0; i < SEARCH_DEPTH_LIMIT*2; i++) {
				path+=`${i}/`;
			}
			return path;
		};

		mockedReaddirSync.mockReturnValue(['what', 'scaffolder']);

		mockedLstatSync.mockReturnValue({
			isDirectory: () => true 
		});
		templatePathsFinder(getAboveThresholdPath());
		expect(mockedReaddirSync).toBeCalledTimes(SEARCH_DEPTH_LIMIT);
	});
});
