const fs = require('fs');
const { templatePathsFinder, commandsBuilder } = require('./index');
const { NoCtfFolder } = require('../../Errors');
jest.mock('fs');
const path = 'g/d/a/s/d/f';

describe('commandsBuilder -> templatePathFinder', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('finds the ctf folder on the first level', () => {
    fs.readdirSync.mockReturnValueOnce(['what', 'ctf']).mockReturnValue([]);
    fs.lstatSync.mockReturnValue({ isDirectory: () => true });
    expect(templatePathsFinder(path)).toHaveLength(1);
  });

  it('finds the ctf folder not on the first level', () => {
    fs.readdirSync
      .mockReturnValueOnce(['what', 'yeah'])
      .mockReturnValueOnce(['what', 'lala'])
      .mockReturnValueOnce(['what', 'ctf'])
      .mockReturnValue([]);

    fs.lstatSync.mockReturnValue({ isDirectory: () => true });
    templatePathsFinder(path);
  });

  it('it ignores the ctf if its a file and not a folder', () => {
    fs.readdirSync
      .mockReturnValueOnce(['what', 'yeah'])
      .mockReturnValueOnce(['what', 'ctf'])
      .mockReturnValueOnce(['what', 'ctf'])
      .mockReturnValue([]);
    fs.lstatSync
      .mockReturnValueOnce({ isDirectory: () => false })
      .mockReturnValueOnce({ isDirectory: () => true });
    templatePathsFinder(path);

    expect(fs.readdirSync).toHaveBeenCalledTimes(path.split('/').length);
  });

  it('throws an error if there is no ctf folder in the hierarchy', () => {
    fs.readdirSync
      .mockReturnValueOnce(['what', 'yeah'])
      .mockReturnValueOnce(['what', '21'])
      .mockReturnValueOnce(['what', '12'])
      .mockReturnValue([]);
    fs.lstatSync.mockReturnValue({ isDirectory: () => true });

    expect(() => templatePathsFinder(path)).toThrow(NoCtfFolder);
  });

  it('finds all levels of ctf', () => {
    const path = '/home/gal/yeah';
    fs.readdirSync
      .mockReturnValueOnce(['what', 'ctf'])
      .mockReturnValueOnce(['what', 'ctf'])
      .mockReturnValueOnce(['what', 'ctf'])
      .mockReturnValueOnce(['cmd1', 'cmd2'])
      .mockReturnValueOnce(['cmd3', 'cmd4'])
      .mockReturnValueOnce(['cmd5', 'cmd6']);
    fs.lstatSync.mockReturnValue({ isDirectory: () => true });

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
      .mockReturnValueOnce(['what', 'ctf'])
      .mockReturnValueOnce(['what', 'ctf'])
      .mockReturnValueOnce(['cmd1', 'cmd2', 'cmd3', 'cmd4', 'cmd5'])
      .mockReturnValueOnce(['cmd7', 'cmd6', 'cmd8', 'cmd9', 'cmd10']);

    fs.lstatSync.mockReturnValue({ isDirectory: () => true });
    expect(commandsBuilder(path)).toEqual({
      cmd1: 'global/templatesAreHere/ctf/cmd1',
      cmd10: 'global/ctf/cmd10',
      cmd2: 'global/templatesAreHere/ctf/cmd2',
      cmd3: 'global/templatesAreHere/ctf/cmd3',
      cmd4: 'global/templatesAreHere/ctf/cmd4',
      cmd5: 'global/templatesAreHere/ctf/cmd5',
      cmd6: 'global/ctf/cmd6',
      cmd7: 'global/ctf/cmd7',
      cmd8: 'global/ctf/cmd8',
      cmd9: 'global/ctf/cmd9',
    });
  });

  it('given two paths with the same template command the closer one will have precednce', () => {
    const path = 'global/templatesAreHere/project';
    fs.readdirSync
      .mockReturnValueOnce(['what', 'yeah'])
      .mockReturnValueOnce(['what', 'ctf'])
      .mockReturnValueOnce(['what', 'ctf'])
      .mockReturnValueOnce(['cmd1', 'cmd2', 'cmd3', 'cmd4', 'cmd5'])
      .mockReturnValueOnce(['cmd1', 'cmd2', 'cmd6', 'cmd7', 'cmd5'])
      .mockReturnValueOnce(['cmd1', 'cmd2', 'cmd3', 'cmd4', 'cmd5']);

    fs.lstatSync.mockReturnValue({ isDirectory: () => true });
    expect(commandsBuilder(path)).toEqual({
      cmd1: 'global/templatesAreHere/ctf/cmd1',
      cmd2: 'global/templatesAreHere/ctf/cmd2',
      cmd3: 'global/templatesAreHere/ctf/cmd3',
      cmd4: 'global/templatesAreHere/ctf/cmd4',
      cmd5: 'global/templatesAreHere/ctf/cmd5',
      cmd6: 'global/ctf/cmd6',
      cmd7: 'global/ctf/cmd7',
    });
  });
});
