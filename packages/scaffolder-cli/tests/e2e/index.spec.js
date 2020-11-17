import { execSync } from 'child_process';
import { existsSync, readFileSync, readdirSync } from 'fs';
import rimraf from 'rimraf';

const execOnTestDir = (cmd, withEntryPoint = true) =>
	execSync(
		`node ${process.cwd()}/dist/cli.js ${cmd} ${
			withEntryPoint ? `--entry-point ${__dirname}/results` : ''
		}`,
		{
			// stdio: 'inherit',
			// stderr: 'inherit',
			cwd: __dirname,
			encoding: 'utf8'
		}
	);

const cleanUp = (folder) => rimraf.sync(`${__dirname}/results/${folder}`);

const isFolderExists = (folder) => {
	try {
		return existsSync(`${__dirname}/results/${folder}`);
	} catch (e) {
		console.log('ERROR::', e);
		return false;
	}
};

const isFileContainsText = (path, content) =>
	readFileSync(path, 'utf-8').includes(content);

const hasFileWithName = (path, fileName) =>
	readdirSync(path).some((name) => name.includes(fileName));

const assertThatTheContextIsPassedCorrectly = (from) => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const context = require(from);
	const contextProperties = [
		'parametersValues',
		'templateName',
		'targetRoot',
		'templateRoot',
		'type',
		'fileName',
	];
	contextProperties.forEach((prop) => {
		expect(context).toHaveProperty(prop);
	});
	return context;
};

describe('e2e', () => {
	afterEach(() => {
		cleanUp('not-nested');
		cleanUp('nested');
		cleanUp('generatedInPostHook');
		cleanUp('generatedInPreHook');
		cleanUp('prefix/not-nested');
		cleanUp('prefix/not-existing');
		cleanUp('preQuestions');
	});

	it('should create the template with the prefix provided', () => {
		execOnTestDir(
			'create not-nested key1=awesome key5=awesome --folder not-nested --path-prefix prefix'
		);

		expect(isFolderExists('prefix/not-nested')).toBeTruthy();

		expect(
			hasFileWithName(`${__dirname}/results/prefix/not-nested`, 'AWESOME.js')
		).toBeTruthy();

		expect(
			isFileContainsText(
				`${__dirname}/results/prefix/not-nested/AWESOME.js`,
				'AWESOME'
			)
		).toBeTruthy();

		expect(
			isFileContainsText(
				`${__dirname}/results/prefix/not-nested/AWESOME.js`,
				`date:${new Date().getDate()}`
			)
		).toBeTruthy();
	});

	it('should create the missing directories in the prefix-path if they are not created yet', () => {
		execOnTestDir(
			'create not-nested key1=awesome key5=awesome --folder not-nested --path-prefix prefix/not-existing'
		);
		expect(isFolderExists('prefix/not-existing/not-nested')).toBeTruthy();
	});

	it('should create the template with the right values as keys', () => {
		execOnTestDir(
			'create not-nested key1=awesome key5=awesome --folder not-nested'
		);
		expect(isFolderExists('not-nested')).toBeTruthy();

		expect(
			hasFileWithName(`${__dirname}/results/not-nested`, 'AWESOME.js')
		).toBeTruthy();

		expect(
			isFileContainsText(
				`${__dirname}/results/not-nested/AWESOME.js`,
				'AWESOME'
			)
		).toBeTruthy();

		expect(
			isFileContainsText(
				`${__dirname}/results/not-nested/AWESOME.js`,
				`date:${new Date().getDate()}`
			)
		).toBeTruthy();

		assertThatTheContextIsPassedCorrectly(
			`${__dirname}/results/not-nested/context.js`
		);
		cleanUp('not-nested');
	});

	it('runs all of the commands without throwing', () => {
		execOnTestDir('list');
		execOnTestDir('show not-nested', false);
		// execOnTestDir("show nested", false);
	});

	describe('hooks', () => {
		it('execute pre generation hook', () => {
			execOnTestDir(
				'create not-nested key1=awesome key5=awesome --folder not-nested'
			);
			expect(isFolderExists('/generatedInPreHook')).toBeTruthy();
		});
	
		it('execute post generation hook', () => {
			execOnTestDir(
				'create nested key=awesome keyF=awesome --folder not-nested'
			);
			expect(isFolderExists('/generatedInPostHook')).toBeTruthy();
		});
	
		it('execute pre asking questions hook', () => {
			const out = execOnTestDir(
				'create preQuestions key=awesome keyF=awesome --folder preQuestions'
			);
			expect(out).toBe('PreAskingQuestion\n');
		});
	});




	it('should create a nested template', () => {
		execOnTestDir('create nested key=awesome keyF=f2 --folder nested');
		expect(isFolderExists('nested')).toBeTruthy();
		expect(
			isFileContainsText(`${__dirname}/results/nested/awesome.js`, 'awesome')
		).toBeTruthy();
		expect(
			isFileContainsText(
				`${__dirname}/results/nested/F2/just-some-file.txt`,
				'lol'
			)
		).toBeTruthy();

		expect(
			isFileContainsText(
				`${__dirname}/results/nested/nest/d/e/eep/shit.js`,
				'whattttt the awesome'
			)
		).toBeTruthy();

		const context = assertThatTheContextIsPassedCorrectly(
			`${__dirname}/results/nested/nest/d/e/eep/context.js`
		);

		expect(context.targetRoot).toBe(`${__dirname}/results`);
		expect(context.currentFilePath).toBe(
			`${__dirname}/results/nested/nest/d/e/eep`
		);

		expect(
			hasFileWithName(`${__dirname}/results/nested`, 'awesome.js')
		).toBeTruthy();

	});
});