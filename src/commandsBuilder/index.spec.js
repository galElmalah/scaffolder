const fs = require('fs');
const { templatePathFinder, commandsBuilder } = require('./index');
const { NoCtfFolder } = require('../../Errors');
jest.mock('fs');
const path = 'g/d/a/s/d/f';

describe('commandsBuilder -> templatePathFinder', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('finds the ctf folder on the first level', () => {
    fs.readdirSync.mockReturnValue(['what', 'ctf']);
    fs.lstatSync.mockReturnValue({ isDirectory: () => true });
    templatePathFinder(path);
  });

  it('finds the ctf folder not on the first level', () => {
    fs.readdirSync
      .mockReturnValueOnce(['what', 'yeah'])
      .mockReturnValueOnce(['what', 'lala'])
      .mockReturnValueOnce(['what', 'ctf']);
    fs.lstatSync.mockReturnValue({ isDirectory: () => true });
    templatePathFinder(path);
  });

  it('it ignores the ctf if its a file and not a folder', () => {
    fs.readdirSync
      .mockReturnValueOnce(['what', 'yeah'])
      .mockReturnValueOnce(['what', 'ctf'])
      .mockReturnValueOnce(['what', 'ctf']);
    fs.lstatSync
      .mockReturnValueOnce({ isDirectory: () => false })
      .mockReturnValueOnce({ isDirectory: () => true });
    templatePathFinder(path);
    // Meaning the first time we encounter ctf we ignore it i.e the first is a file
    expect(fs.readdirSync).toHaveBeenCalledTimes(3);
  });

  it('throws an error if there is no ctf folder in the hierarchy', () => {
    fs.readdirSync
      .mockReturnValueOnce(['what', 'yeah'])
      .mockReturnValueOnce(['what', '21'])
      .mockReturnValueOnce(['what', '12'])
      .mockReturnValue([]);
    fs.lstatSync.mockReturnValue({ isDirectory: () => true });

    expect(() => templatePathFinder(path)).toThrow(NoCtfFolder);
  });
});

describe('commandsBuilder -> commandsBuilder', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('builds the commands with the templates path', () => {
    const path = 'gal/templatesAreHere/notHere';
    fs.readdirSync
      .mockReturnValueOnce(['what', 'yeah'])
      .mockReturnValueOnce(['what', 'ctf'])
      .mockReturnValueOnce(['cmd1', 'cmd2', 'cmd3', 'cmd4', 'cmd5']);
    fs.lstatSync.mockReturnValue({ isDirectory: () => true });
    expect(commandsBuilder(path)).toEqual({
      cmd1: 'gal/templatesAreHere/ctf/cmd1',
      cmd2: 'gal/templatesAreHere/ctf/cmd2',
      cmd3: 'gal/templatesAreHere/ctf/cmd3',
      cmd4: 'gal/templatesAreHere/ctf/cmd4',
      cmd5: 'gal/templatesAreHere/ctf/cmd5',
    });
  });
});
