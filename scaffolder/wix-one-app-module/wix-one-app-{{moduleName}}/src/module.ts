import type {Module, EngineInstance} from 'wix-one-app-engine';
import {saveEngineInstance} from './engineInstance';
// See docs for the full Module API here: https://bo.wix.com/wix-docs/mobile/one-app-engine/api/module-api

export default class ModuleTemplate implements Module {
  constructor({engineInstance}: {engineInstance: EngineInstance}) {
    // @TODO: implement your module engineInstance object controller - see: https://bo.wix.com/wix-docs/mobile/one-app-engine/api/intro#one-app-engine_api_intro_the-scoped-engine-instance-object
    saveEngineInstance(engineInstance);
  }
  components() {
    return [
      {
        id: 'template.MainScreen',
        name: 'MainScreen',
        generator: () => require('./MainScreen').MainScreen,
        description: 'Main screen of the App',
      },
    ];
  }

  methods() {
    return [];
  }

  prefix() {
    return 'template';
  }

  // Optional
  consumedServices() {
    return {};
  }
}
