export default class Demo {
  __unsafe__initializeDemoModule() {
    const MockTools = require('wix-one-app-engine/lib/MockTools');
    const loginMode = MockTools.getLoginMode();
    if (loginMode === 'quickLogin') {
      const {credentials} = require('../credentials');
      MockTools.setLoginData({loginCredentials: credentials});
    }
  }

  components() {
    return [
      {
        id: 'demo.DemoTab',
        name: 'DemoTab',
        generator: () => require('./DemoTab').DemoTab,
        description: 'A demo tab for checking the module base logic',
      },
    ];
  }

  methods() {
    return [];
  }

  prefix() {
    return 'demo';
  }

  name() {
    return 'demo';
  }

  tabs() {
    return [{
      id: 'demoTab',
      label: 'DEMO',
      biLabel: 'demo',
      screen: 'demo.DemoTab',
      icon: require('./assets/demo_tab_icon.png'),
      selectedIcon: require('./assets/demo_tab_icon.png'),
      title: 'DEMO',
      testID: 'demo.DEMO_TAB',
    }];
  }
}
