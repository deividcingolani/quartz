import { Models } from '@rematch/core';

// Models
import counter from './counter/counter.model';

export interface RootModel extends Models<RootModel> {
  counter: typeof counter;
}

const models: RootModel = { counter };

export default models;
