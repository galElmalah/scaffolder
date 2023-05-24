import type {EngineInstance} from 'wix-one-app-engine';

let engineInstance: EngineInstance;
export function saveEngineInstance(instance: EngineInstance) {
  engineInstance = instance;
}

export function engine() {
  return engineInstance;
}
