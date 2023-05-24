import {engineDriver, screen} from '@wix/amino';
import {netmock} from 'netmock-js';

describe('Main Screen', () => {
  beforeEach(async () => {
    netmock.get('https://blamos.co.il/:bla', (req) => ({wow: req.params.bla}));
    engineDriver.admin.builder.withModule('@wix/wix-one-app-{{moduleName}}');
    engineDriver.admin.appState.withUserId('fde01512-8eed-4f42-878f-b891a7a1be66');
    engineDriver.admin.builder.withDemoTab('tabId', () => require('../src/MainScreen').MainScreen);
    await engineDriver.admin.launch();
  });

  it('Should render main screen correctly', async () => {
    await screen.findByTestId('mainScreen').assertExists();
  });

  it('Should change to react logo on press', async () => {
    await screen.findByText('Wix').assertExists();
    await screen.findByImageSource(require('../src/assets/wixapp.png')).assertExists();
    await screen.findByText('React').assertNotExists();
    await screen.findByTestId('button').press();
    await screen.findByText('React').assertExists();
    await screen.findByImageSource(require('../src/assets/react_logo.png')).assertExists();
    await screen.findByText('Wix').assertNotExists();
  });
});
