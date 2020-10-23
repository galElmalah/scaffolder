import * as path from 'path';
import { createTemplateStructure } from '../index';

const expectedTemplate = [
	{
		content: '',
		name: 'another.js',
		scaffolderTargetRoot:
      `${__dirname}/example`,
	},
	{
		content: '',
		name: 'file.js',
		scaffolderTargetRoot:
      `${__dirname}/example`,
	},
	{
		content: [
			{
				content: '',
				name: 'some-file.js',
				scaffolderTargetRoot:
          `${__dirname}/example/some-folder`,
			},
		],
		name: 'some-folder',
		scaffolderTargetRoot:
      `${__dirname}/example`,
		type: 'FOLDER',
	},
];
describe('template reader', () => {
	it('should create a tree structure matching the provided template',async () => {
		expect(await createTemplateStructure(path.join(__dirname, '/example'))).toEqual(expectedTemplate);
	});
});
