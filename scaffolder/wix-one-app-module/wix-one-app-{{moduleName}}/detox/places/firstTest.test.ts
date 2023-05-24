import MockTools from 'wix-one-app-engine/lib/MockTools';
import OneAppStateBuilder from 'wix-one-app-engine/lib/OneAppStateBuilder';
import {expect} from 'detox';

describe('Home Screen', () => {
  beforeAll(async () => {
    const appStateBuilder = new OneAppStateBuilder()
      .withUserId('fde01512-8eed-4f42-878f-b891a7a1be66')
      .withBusiness('mock_bid_1', 'Mock Business 1', true, 'blamos', true, 1)
      .build();
    // @ts-ignore
    await MockTools.setLoginData({oneAppState: appStateBuilder});
    await device.launchApp({delete: true});
  });

  it('Starts with initial text Wix', async () => {
    await element(by.id('demo.DEMO_APP')).tap();
    await expect(element(by.id('title'))).toHaveText('Wix');
    await element(by.id('button')).tap();
    await expect(element(by.id('title'))).toHaveText('React');
  });
});
