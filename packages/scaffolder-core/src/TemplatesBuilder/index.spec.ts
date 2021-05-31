import { existsSync, mkdirSync } from 'fs';
import { TemplatesBuilder } from './index';
import { join } from '../filesUtils';
import { FolderAlreadyExists } from '../Errors';

jest.mock('fs');

describe('TemplatesBuilder', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('when invoking inAFolder a new folder is created', () => {
		const folder = 'MyFolder';
		(existsSync as jest.Mock).mockReturnValue(false);
		const templateBuilder = new TemplatesBuilder([]);
		templateBuilder.inAFolder(folder).build();
		expect(mkdirSync).toBeCalledWith(join(process.cwd(), folder));
	});

	it('if a folder with the same name exists in the path then a FolderAlreadyExists error is thrown', () => {
		const folder = 'MyFolder';
		(existsSync as jest.Mock).mockReturnValue(true);
		const templateBuilder = new TemplatesBuilder([]);
		expect(() => templateBuilder.inAFolder(folder).build()).toThrow(
			FolderAlreadyExists
		);
		expect(mkdirSync).not.toHaveBeenCalled();
	});

	it('when invoking create an array of promises is returned', () => {
		const templates = [
			{ name: 'gal', content: 'what' },
			{ name: 'gal1', content: 'what1' },
			{ name: 'gal2', content: 'what2' },
		];
		const templateBuilder = new TemplatesBuilder(templates);
		const result = templateBuilder.build();
		expect(result).toHaveLength(3);
		result.forEach((p) => {
			expect(p).toBeInstanceOf(Promise);
		});
	});

	it('should create the missing path parts', () => {
		const folder = 'add/here';
		(existsSync as jest.Mock).mockReturnValue(false);
		const templateBuilder = new TemplatesBuilder([]);
		templateBuilder.withPathPrefix(folder).build();

		expect(mkdirSync).toHaveBeenCalledWith(join(process.cwd(), 'add'));
		expect(mkdirSync).toHaveBeenCalledWith(join(process.cwd(), folder));
	});
});
