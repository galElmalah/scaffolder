const fs = require('fs');
const { templatePathsFinder, commandsBuilder, SEARCH_DEPTH_LIMIT } = require('./index');
const { NoscaffolderFolder } = require('../../Errors');

jest.mock('fs');
const path = 'g/d/a/s/d/f';

describe('commandsBuilder -> templatePathFinder', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('finds the scaffolder folder on the first level', () => {
		fs.readdirSync
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValue([]);
		fs.lstatSync.mockReturnValue({
			isDirectory: () => true 
		});
		expect(templatePathsFinder(path)).toHaveLength(1);
	});

	it('finds the scaffolder folder not on the first level', () => {
		fs.readdirSync
			.mockReturnValueOnce(['what', 'yeah'])
			.mockReturnValueOnce(['what', 'lala'])
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValue([]);

		fs.lstatSync.mockReturnValue({
			isDirectory: () => true 
		});
		templatePathsFinder(path);
	});

	it('it ignores the scaffolder if its a file and not a folder', () => {
		fs.readdirSync
			.mockReturnValueOnce(['what', 'yeah'])
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValue([]);
		fs.lstatSync
			.mockReturnValueOnce({
				isDirectory: () => false 
			})
			.mockReturnValueOnce({
				isDirectory: () => true 
			});
		templatePathsFinder(path);

		expect(fs.readdirSync).toHaveBeenCalledTimes(path.split('/').length);
	});

	it('throws an error if there is no scaffolder folder in the hierarchy', () => {
		fs.readdirSync
			.mockReturnValueOnce(['what', 'yeah'])
			.mockReturnValueOnce(['what', '21'])
			.mockReturnValueOnce(['what', '12'])
			.mockReturnValue([]);
		fs.lstatSync.mockReturnValue({
			isDirectory: () => true 
		});

		expect(() => templatePathsFinder(path)).toThrow(NoscaffolderFolder);
	});

	it('finds all levels of scaffolder', () => {
		const path = '/home/gal/yeah';
		fs.readdirSync
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValueOnce(['cmd1', 'cmd2'])
			.mockReturnValueOnce(['cmd3', 'cmd4'])
			.mockReturnValueOnce(['cmd5', 'cmd6']);
		fs.lstatSync.mockReturnValue({
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
		fs.readdirSync
			.mockReturnValueOnce(['what', 'yeah'])
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValueOnce(['cmd1', 'cmd2', 'cmd3', 'cmd4', 'cmd5'])
			.mockReturnValueOnce(['cmd7', 'cmd6', 'cmd8', 'cmd9', 'cmd10']);

		fs.lstatSync.mockReturnValue({
			isDirectory: () => true 
		});
		expect(commandsBuilder(path)).toEqual({
			cmd1: 'global/templatesAreHere/scaffolder/cmd1',
			cmd10: 'global/scaffolder/cmd10',
			cmd2: 'global/templatesAreHere/scaffolder/cmd2',
			cmd3: 'global/templatesAreHere/scaffolder/cmd3',
			cmd4: 'global/templatesAreHere/scaffolder/cmd4',
			cmd5: 'global/templatesAreHere/scaffolder/cmd5',
			cmd6: 'global/scaffolder/cmd6',
			cmd7: 'global/scaffolder/cmd7',
			cmd8: 'global/scaffolder/cmd8',
			cmd9: 'global/scaffolder/cmd9',
		});
	});

	it('given two paths with the same template command the closer one will have precednce', () => {
		const path = 'global/templatesAreHere/project';
		fs.readdirSync
			.mockReturnValueOnce(['what', 'yeah'])
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValueOnce(['what', 'scaffolder'])
			.mockReturnValueOnce(['cmd1', 'cmd2', 'cmd3', 'cmd4', 'cmd5'])
			.mockReturnValueOnce(['cmd1', 'cmd2', 'cmd6', 'cmd7', 'cmd5'])
			.mockReturnValueOnce(['cmd1', 'cmd2', 'cmd3', 'cmd4', 'cmd5']);

		fs.lstatSync.mockReturnValue({
			isDirectory: () => true 
		});
		expect(commandsBuilder(path)).toEqual({
			cmd1: 'global/templatesAreHere/scaffolder/cmd1',
			cmd2: 'global/templatesAreHere/scaffolder/cmd2',
			cmd3: 'global/templatesAreHere/scaffolder/cmd3',
			cmd4: 'global/templatesAreHere/scaffolder/cmd4',
			cmd5: 'global/templatesAreHere/scaffolder/cmd5',
			cmd6: 'global/scaffolder/cmd6',
			cmd7: 'global/scaffolder/cmd7',
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

		fs.readdirSync.mockReturnValue(['what', 'scaffolder']);

		fs.lstatSync.mockReturnValue({
			isDirectory: () => true 
		});
		templatePathsFinder(getAboveThresholdPath());
		expect(fs.readdirSync).toBeCalledTimes(SEARCH_DEPTH_LIMIT);
	});
});
