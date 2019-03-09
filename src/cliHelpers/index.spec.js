const { handleError, generateKeyValues } = require('./index');

describe('cliHelpers', () => {
  it('calls the getDisplayErrorMessage method', () => {
    const errMock = {
      getDisplayErrorMessage: jest.fn(),
    };
    handleError(errMock);
    expect(errMock.getDisplayErrorMessage).toHaveBeenCalled();
  });

  it('generate key value pairs as expected', () => {
    // the four first args are some default args that get passed to the console
    const args = [1, 2, 3, 4, 'gal=awesome', 'what=yeah'];
    const cmd = {
      parent: {
        rawArgs: args,
      },
    };
    expect(generateKeyValues(cmd)).toEqual({
      gal: 'awesome',
      what: 'yeah',
    });
  });

  it('remove whitespaces from the key values supplied', () => {
    // the four first args are some default args that get passed to the console
    const args = [1, 2, 3, 4, 'gal       =       awesome', '  what= yeah  '];
    const cmd = {
      parent: {
        rawArgs: args,
      },
    };
    expect(generateKeyValues(cmd)).toEqual({
      gal: 'awesome',
      what: 'yeah',
    });
  });
});
